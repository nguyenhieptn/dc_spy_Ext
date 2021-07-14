let NerdKungfu = class {
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
                if (document.querySelector("div.productView")) {
                    console.log('dvh');
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (document.querySelector('#product-listing-container')) {
                    this.getProducts((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let title = document.querySelector(".productView-title").innerText;
        let banner = null;
        let _images = [];
        if (document.querySelector("ul.productView-thumbnails li.productView-thumbnail") !== null) {
            document.querySelectorAll("ul.productView-thumbnails li.productView-thumbnail").forEach((e) => {
                let imageUrl = e.querySelector('a img').getAttribute('srcset');
                console.log(imageUrl);
                imageUrl = imageUrl.split(", ");
                imageUrl = imageUrl[imageUrl.length - 1];
                imageUrl = imageUrl.substring(0, imageUrl.indexOf(' '));
                console.log(imageUrl);
                if (isURL(imageUrl)) {
                    imageUrl = new URL(imageUrl);
                    imageUrl = imageUrl.origin + imageUrl.pathname;
                    _images.push(imageUrl);
                }
            })
        }
        console.log(_images);
        let pId = null;
        pId = location.origin+location.pathname;
        if (!pId) return;
        let tags = [];
        let images = [];
        if (_images.length > 0) {
            images = _images;
            banner = images.shift();
        }
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "NerdKungfu"
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
        let products = [];
        if (document.querySelector('#product-listing-container ul.productGrid')) {
            document.querySelectorAll('#product-listing-container ul.productGrid li.product').forEach((el) => {
                    let title = el.querySelector("h4.card-title a").innerText;
                    if (el.querySelector(".card-img-container img")) {
                        let banner = el.querySelector('.card-img-container img').getAttribute('srcset')
                        banner = banner.split(", ");
                        banner = banner[banner.length - 1];
                        banner = banner.substring(0, banner.indexOf(' '));
                        banner = new URL(banner);
                        banner = banner.origin + banner.pathname;
                        if (isURL(banner) && banner != null) {
                            let pId = el.querySelector("figure.card-figure a").getAttribute("href");
                            let tags = [];
                            let product = {
                                type: "",
                                title: title,
                                banner: banner,
                                item_id: pId,
                                tags: tags,
                                store: location.host,
                                market: "NerdKungfu"
                            };
                            products.push(product);
                        }
                    }
                }
            );
        }
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
