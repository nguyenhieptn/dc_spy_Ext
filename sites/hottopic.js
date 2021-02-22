let HotTopic = class {
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
                if (document.querySelector('#pdpMain')) {
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (document.querySelector('#results-products')) {
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
        let title = document.querySelector('#pdpMain h1.productdetail__info-title').innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll('#pdpMain div.productdetail__image-thumbnail div').forEach(function (el) {
            let _img = el.querySelector('picture img').getAttribute('src');
            if (_img.indexOf('productThumbDesktop')) {
                images.push(_img.replace('productThumbDesktop', 'productMainDesktop'));
            }
        })
        banner = images.shift();
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
            market: location.host
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
        if (document.querySelector('#results-products ul')) {
            document.querySelectorAll('#results-products ul li.grid-tile').forEach((el) => {
                    let title = el.querySelector(".product-image a.thumb-link").getAttribute('title');
                    let images = [];
                    el.querySelectorAll('picture').forEach((ele) => {
                        let _img = ele.querySelector('img').getAttribute('src');
                        if (_img.indexOf('productTileDesktop')) {
                            images.push(_img.replace('productTileDesktop', 'productMainDesktop'));
                        }
                    })
                    if (images.length > 0) {
                        let banner = images.shift();
                        if (isURL(banner) && banner != null) {
                            let pId =  new URL(el.querySelector(".product-image a.thumb-link").getAttribute('href'));
                            pId = pId.pathname;
                            let tags = [];
                            let product = {
                                type: "",
                                title: title,
                                banner: banner,
                                images: images,
                                item_id: pId,
                                tags: tags,
                                store: location.host,
                                market: location.host
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