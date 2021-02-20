let Poshmard = class {
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
                if (location.pathname.indexOf('/listing/') === 0) {
                    console.log('dvh');
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (location.pathname.indexOf('/brand/') || location.pathname.indexOf('/search')) {
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
        let title = document.querySelector("#content div.listing__title h1").innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll('#content .listing__image div.carousel__inner ul li.carousel__item').forEach(function (el) {
            if (el.querySelector(' div img').getAttribute('src'))
                images.push(el.querySelector(' div img').getAttribute('src'));
            else
                images.push(el.querySelector(' div img').getAttribute('data-src'));
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
        if (document.querySelector('section.main__column')) {
            document.querySelectorAll('section.main__column div:last-child div.tile').forEach((el) => {
                    if (!el.querySelector("a:last-child > p") || !el.querySelector("a:last-child div span img")) {
                        return;
                    }
                    let title = el.querySelector("a:last-child > p").innerText;
                    let banner = el.querySelector("a:last-child div span img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        if (banner.indexOf('_thumbnail')) {
                            banner = banner.replace('_thumbnail', '');
                        }
                        let pId = el.querySelector("a:last-child").getAttribute("href");
                        pId = new URL(location.origin + pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "woo"
                        };
                        products.push(product);
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