let WooStoreFront = class {
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
        let banner = null;
        let images = [];
        document.querySelectorAll("body.single-product .images ol.flex-control-thumbs li").forEach((el) => {
            let _img = el.querySelector('img').getAttribute('src');
            if (_img.indexOf('-100x100')) {
                _img = _img.replace('-100x100', '');
            }
            if (images.indexOf(_img) === -1)
                images.push(_img);
        })
        banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];
        if(document.querySelector('span.tagged_as'))
        {
            document.querySelectorAll('span.tagged_as a').forEach(function (e) {
                tags.push(e.textContent);
            })
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "Woo"
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
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let products = [];
        document.querySelectorAll("body.archive .products .product").forEach((el) => {
                let title = el.querySelector("h2.woocommerce-loop-product__title").innerText;
                if (el.querySelector(".attachment-woocommerce_thumbnail") !== null) {
                    let banner = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute("src");
                    if (banner.indexOf('-356-442')) {
                        banner = banner.replace('-356-442', '');
                    }
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        banner = banner.substr(0, banner.lastIndexOf("-"));
                        banner = banner + ext;
                        let pId = el.querySelector("a.woocommerce-loop-product__link").getAttribute("href");
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
                            market: "Woo"
                        };
                        products.push(product);
                    }
                }
            }
        );
        console.log(products);
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