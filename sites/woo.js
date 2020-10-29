let Woo = class {
    constructor() {
        this.domain = location.origin;
        this.href = location.href;
        this.init();
    }

    init() {
        console.log('dvh');
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
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector("body.single .product")) {
                console.log('dvh');
                this.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (document.querySelector("body.archive .products")) {
                this.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            }
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
        let title = document.querySelector(".single-product .product-title").innerText;
        let banner = null;
        let _images = [];
        if(document.querySelector("img[data-large_image]") === null)
        {
            if(location.origin == "https://wozoro.com") {
                banner = document.querySelector(".single-product-main-image img").getAttribute("src");
                if (document.querySelectorAll(".slick-slider .slick-list .slick-slide:not(.slick-active)"))
                {
                    document.querySelectorAll(".slick-slider .slick-list .slick-slide:not(.slick-active)").forEach((e)=>{
                       let imageUrl =  new URL(e.querySelector('img').getAttribute('src'));
                       imageUrl = imageUrl.origin+imageUrl.pathname;
                        _images.push(imageUrl);
                    })
                }
            }
        }
        else
        {
            banner = document.querySelector("img[data-large_image]").getAttribute("data-large_image");
        }
        if (!isURL(banner)) return;
        let pId = null;
        // document.body.classList.forEach((item)=>{
        //   if(item.indexOf("postid-") === 0){
        //     pId = item.substring(7);
        //     return;
        //   }
        // });
        pId = window.location.href;
        if (!pId) return;
        let elm = document.querySelector("[data-content_category]");
        let tags = [];
        if (elm) {
            tags = JSON.parse(elm.getAttribute("data-content_category"));
        }
        if(tags.length === 0)
        {
            if(document.querySelector('span.tagged_as') !== null)
            {
                document.querySelectorAll('span.tagged_as a').forEach((e)=>{
                    tags.push(e.textContent);
                });
            }
        }

        let images = [];
        if(_images.length > 0)
        {
            images = _images;
        }
        else {
            document.querySelectorAll(".product-thumbnails .attachment-woocommerce_thumbnail").forEach(function (el) {
                images.push(el.getAttribute("src"));
            })
        }
        let product = {
            type: type,
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "woo"
        };
        console.log(product);
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: [product],
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        console.log(campaign_id);
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if (type.length === 0) {
            expToast("error", "Please select type!");
            return;
        }
        let products = [];
        document.querySelectorAll("body.archive .products .product").forEach((el) => {
                let title = el.querySelector(".product-title a").innerText;
                let banner = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute("src");
                let src = banner;
                if (!isURL(banner)) return;
                let ext = banner.substr(banner.lastIndexOf("."));
                let url = new URL(banner);
                if (url.origin !== location.origin) {
                    banner = url.origin + url.pathname;
                    if (banner.indexOf('wp-content') == -1) {
                        banner = banner.substring(0, banner.lastIndexOf("-")) + ext;
                    }
                    else{
                        let elImage = el.querySelector("img.attachment-woocommerce_thumbnail");
                        if (elImage.hasAttributes(['width', 'height'])) {
                            let width = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute('width');
                            let height = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute('height');
                            banner = url.origin + url.pathname.replace('-' + width + 'x' + height, '');
                        }
                    }
                } else {
                    if (banner.indexOf('wp-content') == -1) {
                        banner = banner.substring(0, banner.lastIndexOf("-")) + ext;
                    } else {
                        let elImage = el.querySelector("img.attachment-woocommerce_thumbnail");
                        if (elImage.hasAttributes(['width', 'height'])) {
                            let width = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute('width');
                            let height = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute('height');
                            banner = url.origin + url.pathname.replace('-' + width + 'x' + height, '');
                        }
                    }
                }
                let pId = el.querySelector(".product-title a").getAttribute("href");
                let elm = el.querySelector("[data-content_category]");
                let tags = [];
                if (elm) {
                    tags = JSON.parse(elm.getAttribute("data-content_category"));
                }
                let product = {
                    type: type,
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market: "woo"
                };
                products.push(product);
            }
        );
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
};