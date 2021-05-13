let Eigengift = class {
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
                if (document.querySelector('.product-detail') && document.querySelector('.product-detail-contents')) {
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                }else if(document.querySelector('#page_category'))
                {
                    this.getProducts((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })

                }
                else
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
        let container = document.querySelector('.product-detail-contents');
        let title = container.querySelector('h1.product_detail_name').innerText;
        let banner;
        let images = [];
        document.querySelectorAll('.product-gallery__thumbs .product-gallery__thumbs-container > div').forEach(function(v, ){
            images.push(v.querySelector('img').getAttribute('src'));
        });
        banner = images.shift();
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
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
            market: "Eigengift"
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
        document.querySelectorAll('#page_category .product_list .product_item').forEach((el) => {
                let title = el.querySelector("h3.product_item_name a").getAttribute('title');
                if (el.querySelector(".product_item_thumb img")) {
                    let banner = el.querySelector(".product_item_thumb img").getAttribute('src');
                    console.log(banner);
                    if (isURL(banner) && banner != null) {
                        let pId = el.querySelector("h3.product_item_name a").getAttribute("href");
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
                            market: "Eigengift"
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