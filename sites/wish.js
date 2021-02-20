let Wish = class {
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
                if (document.querySelector('#react-app div[class^=ProductPage]')) {
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                }
                else
                {
                    expToast("error", "cant crawl this page!");
                }
                // else if (document.querySelector('html.category-page') || document.querySelector('html.search-page')) {
                //     this.getProducts((data) => {
                //         button.classList.remove("is-loading");
                //         if (data.status === "succeed") {
                //             expToast("success", "Push Successfully!");
                //         } else {
                //             expToast("error", data.msg);
                //         }
                //     })
                // }
            });
        }
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let title = document.querySelector("h1[class^=PurchaseContainer__Name]").innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll("div[class^=ProductImageContainer__StripImagesWrapper] div[class^=ProductImageContainer__StripImages] div[class^=ProductImageContainer__StripImageWrapper]").forEach(function (el) {
            let image = el.querySelector('img').getAttribute('src');
            if (isURL(image) && image != null) {
                image = new URL(image);
                image = image.origin + image.pathname;
                if(image.indexOf('-tiny'))
                {
                    image = image.replace('-tiny', "-larger");
                }
                if(image.indexOf('-small'))
                {
                    image = image.replace('-small', "-larger");
                }
                images.push(image);
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
        // chrome.runtime.sendMessage({
        //     action: 'xhttp',
        //     method: 'POST',
        //     url: DataCenter + "/api/campaigns/products",
        //     headers: {
        //         token: token
        //     },
        //     data: JSON.stringify({
        //         products: [product],
        //         campaign_id: campaign_id
        //     })
        // }, function (responseText) {
        //     let data = JSON.parse(responseText);
        //     callback(data);
        // });
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let products = [];
        document.querySelectorAll('div.main-products > div:not(.ias-noneleft)').forEach((el) => {
                let title = el.querySelector("h4.name a").innerText;
                let banner = el.querySelector(".product-thumb div.image a img").getAttribute("src");
                console.log(banner);
                if (isURL(banner) && banner != null) {
                    if (banner.indexOf('/cache')) {
                        banner = banner.replace('/cache', '');
                    }
                    if (banner.indexOf('-228x228')) {
                        banner = banner.replace('-228x228', '');
                    }
                    let pId = el.querySelector("h4.name a").getAttribute("href");
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
                        market: location.host
                    };
                    products.push(product);
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