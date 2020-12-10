let WooShopTimizer = class {
    constructor() {
        this.domain = location.origin;
        this.href = location.href;
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
            let template = document.createElement("div");
            template.classList.add("exp-template");
            let input = document.createElement("input");
            input.name = "campaign_id";
            input.placeholder = "Campaign ID";
            input.classList.add("exp-input");
            template.appendChild(input);
            let button = document.createElement("button");
            button.classList.add("exp-btn");
            button.innerText = "Push Data";
            template.appendChild(button);
            document.body.appendChild(template);
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("body.single-product")) {
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
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let title = document.querySelector("body.single-product .product_title").innerText;
        let banner = document.querySelector("img[data-large_image]").getAttribute("data-large_image");
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        // document.body.classList.forEach((item)=>{
        //   if(item.indexOf("postid-") === 0){
        //     pId = item.substring(7);
        //     return;
        //   }
        // });
        pId = window.location.pathname;
        if (!pId) return;
        let elm = document.querySelector("[data-content_category]");
        let tags = [];
        if (elm) {
            tags = JSON.parse(elm.getAttribute("data-content_category"));
        }
        if (tags.length === 0) {
            if (document.querySelector('span.tagged_as') !== null) {
                document.querySelectorAll('span.tagged_as a').forEach((e) => {
                    tags.push(e.textContent);
                });
            }
        }

        let images = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "wooShopTimizer"
        };
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
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let products = [];
        document.querySelectorAll("body.archive .products .product").forEach((el) => {
                let title = el.querySelector(".woocommerce-loop-product__title a").innerText;
                if (el.querySelector(".woocommerce-image__wrapper") !== null) {
                    let banner = el.querySelector(".woocommerce-image__wrapper a img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        banner = banner.substr(0, banner.lastIndexOf("-"));
                        banner = banner + ext;
                        let pId = el.querySelector(".woocommerce-loop-product__title a").getAttribute("href");
                        pId = new URL(pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "wooShopTimizer"
                        };
                        products.push(product);
                    }
                }
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