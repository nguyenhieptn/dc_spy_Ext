let Walmart = class {
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
        let button = document.createElement("button");
        button.classList.add("exp-btn");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (window.location.pathname.indexOf('search') !== -1) {
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (document.querySelector('#product-overview')) {
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                });
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts(callback) {
        let products = [];
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        document.querySelectorAll(".search-result-gridview-items li").forEach((el) => {
            let elm = el.querySelector("div.orientation-square img");
            if (elm === null) {
                return;
            }
            let banner = elm.getAttribute("src");
            // banner = banner.replace("307.jpg", "5000.jpg");
            let images = [];
            if (!isURL(banner)) {
                return;
            } else {
                banner = new URL(banner);
                banner = banner.host + banner.pathname;
            }
            let title = elm.getAttribute("alt");
            let pId = el.querySelector(".search-result-productimage").getAttribute('href');
            let tags = [];
            let store = "walmart";
            let type = "";
            let product = {
                type: type,
                title: title,
                banner: banner,
                images: images,
                item_id: pId,
                tags: tags,
                store: store,
                market: "walmart"
            };
            products.push(product);
        });
        console.log(products);
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token:token
            },
            data:JSON.stringify({
                products:products,
                campaign_id:campaign_id
            })
        }, function(responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }

    getProduct(callback) {
        let title = document.querySelector("#product-overview h1.prod-ProductTitle").innerText;
        let store = "walmart";
        let pId = location.pathname;
        let images = [];
        if (document.querySelectorAll(".ViewSelectorItem-image").length > 0)
            document.querySelectorAll(".ViewSelectorItem-image").forEach(function (el) {
                let image = el.getAttribute("src");
                image = image.replace('max_dim=65', 'max_dim=1000');
                images.push(image);
            });
        else {
            expToast("error", "Error crawl images!");
            return;
        }
        let banner = images.shift();
        let type = "";
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "walmart"
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
};