let GearBubble = class {
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
                if (document.querySelector("#zoom-container")) {
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (location.pathname.indexOf('category') || location.pathname.indexOf('search')) {
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
        let title = document.querySelector("h4.form-title").innerText;
        let banner = null;
        let images = [];
        if (document.querySelector(".product-thumbnails a"))
        {
            document.querySelectorAll(".product-thumbnails a").forEach((el) => {
                let _img = el.querySelector('img').getAttribute('src');
                images.push(_img);
            })
        }
        else
        {
            images.push(document.querySelector('#product-image img').getAttribute('src'));
        }
        banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "gearbubble"
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
        document.querySelectorAll("ul.add-product-list > li").forEach((el) => {
                let title = el.querySelector("h4.field-title a").innerText;
                if (el.querySelector("div.image-block a") !== null) {
                    let banner = null;
                    if (el.querySelector("div.image-block a .card .front"))
                        banner = el.querySelector("div.image-block a .card .front img").getAttribute("src");
                    else
                        banner = el.querySelector("div.image-block a .card img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let images = [];
                        if (el.querySelector("div.image-block a .card .back img")) {
                            images.push(el.querySelector("div.image-block a .card .back img").getAttribute('src'));
                        }
                        let pId = el.querySelector("div.image-block a").getAttribute("href");
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            images: images,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "gearbubble"
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