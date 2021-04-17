let EuroPosters = class {
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
                if (document.querySelector("div.portrait")) {
                    console.log('dvh');
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (document.querySelector('.glass-catalog-page > .jscroll-inner > .product-shadow-hover')) {
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
        let container = document.querySelector('.portrait');
        let title = container.querySelector('h1').innerText;
        let banner = null;
        let _images = [];
        if (container.querySelector("#images-cover") !== null) {
            container.querySelectorAll("#images-cover span > picture > img").forEach((e) => {
                let imageUrl = e.getAttribute('src');
                if (isURL(imageUrl)) {
                    _images.push(imageUrl);
                }
            })
            container.querySelectorAll("#images-cover div.wall-merch > img").forEach((e) => {
                let imageUrl = e.getAttribute('src');
                if (isURL(imageUrl)) {
                    _images.push(imageUrl);
                }
            })

        }
        console.log(_images);
        let pId = null;
        pId = location.origin + location.pathname;
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
            market: "Europosters"
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
        document.querySelectorAll('.glass-catalog-page > .jscroll-inner > .product-shadow-hover').forEach((el) => {
                let title = el.querySelector(".product-name a").innerText;
                if (el.querySelector("picture img")) {
                    let banner = el.querySelector("picture img").getAttribute('src');
                    banner = banner.replace('/350/', '/750/');
                    if (isURL(banner) && banner != null) {
                        let pId = el.querySelector("a.picture-cover").getAttribute("href");
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "Europosters"
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