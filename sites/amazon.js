let Amazon = class {
    constructor() {
        this.domain = location.origin;
        this.init();
    }

    init() {
        let template = document.createElement("div");
        template.classList.add("exp-template");
        let input = document.createElement("input");
        input.name = "campaign_id";
        input.placeholder = "Campaign ID";
        input.classList.add("exp-input");
        template.appendChild(input);
        let select = document.createElement("select");
        select.name = "product_type";
        select.classList.add("exp-select");
        let option = document.createElement("option");
        option.value = "";
        option.innerText = "Select Type";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "mug";
        option.innerText = "Mug";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "shirt";
        option.innerText = "Shirt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "quilt";
        option.innerText = "Quilt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "shirt3d";
        option.innerText = "3D Shirt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "mask";
        option.innerText = "Mask";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "other";
        option.innerText = "Other";
        select.appendChild(option);
        template.appendChild(select);
        let button = document.createElement("button");
        button.classList.add("exp-btn");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (location.href.indexOf("https://www.amazon.com/") !== -1 && location.href.indexOf("/dp/") !== -1) {
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (location.href.indexOf("https://www.amazon.com/s") !== -1) {
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                });
            }
        });
    }

    getProducts(callback) {
        let keyword = document.querySelector("input[name=\"field-keywords\"]").value;
        let products = [];
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if (type.length === 0) {
            expToast("error", "Please select type!");
            return;
        }
        document.querySelectorAll("[data-component-type=\"s-search-results\"] > .s-search-results [data-asin]").forEach((el) => {
            let elm = el.querySelector("img[class*=\"image\"]");
            if(elm == null) return;
            let banner = elm.getAttribute("src");
            if (!isURL(banner)) return;
            banner = banner.substring(0, banner.lastIndexOf("."));
            banner = banner.substring(0, banner.lastIndexOf("."));
            banner += "._SL1500_.jpg";
            let title = elm.getAttribute("alt");
            let pId = el.getAttribute("data-asin");
            let tags = [];
            tags.push(keyword);
            let store = "";
            let product = {
                type: type,
                title: title,
                banner: banner,
                item_id: pId,
                tags: tags,
                store: store,
                market: "amazon"
            };
            products.push(product);
        });
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: products,
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if (type.length === 0) {
            expToast("error", "Please select type!");
            return;
        }
        let title = document.querySelector("#productTitle").innerText.trim();
        let elm = document.querySelector("#bylineInfo");
        let store = (elm) ? elm.innerText : "";
        let pId;
        if (document.querySelector('#averageCustomerReviews') != null) {
            if (document.getElementById('variation_color_name ul') != null) {
                let colorSelected = document.getElementById('variation_color_name').querySelector('ul .swatchSelect');
                pId =  colorSelected.getAttribute('data-defaultasin');
            } else
                pId = document.querySelector('#averageCustomerReviews').getAttribute
                ('data-asin');
        } else {
            let urlArray = window.location.pathname.split('/');
            let indexDp = urlArray.indexOf("dp");
            if (typeof urlArray[indexDp + 1] == "undefined") {
                expToast("error", "Cant get source id!");
                return;
            } else
                pId = urlArray[++indexDp];
        }
        let images = [];
        document.querySelectorAll("#altImages .imageThumbnail input.a-button-input").forEach(function (el) {
            el.click();
        });
        document.querySelectorAll("#main-image-container li.image img").forEach(function (el) {
            let url = el.getAttribute("data-old-hires");
            if (isURL(url))
                images.push(url);
        });
        let banner = images.shift();
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "amazon"
        };
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/product",
            headers: {
                token: token
            },
            data: JSON.stringify({
                product: product,
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }
};