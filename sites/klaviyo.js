let Klaviyo = class {
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
        if (location.pathname.indexOf('collections') !== -1 && user.id === 1) {
            input = document.createElement("input");
            input.name = "collection_id";
            input.placeholder = "collection id";
            input.classList.add("exp-input");
            template.appendChild(input);
        }
        let button = document.createElement("button");
        button.classList.add("exp-btn");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        window.onload = function () {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.getElementById('search') || (document.getElementById('collection') && user.id === 1)) {
                    that.getProducts((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (document.getElementById('product')) {
                   console.log(window);
                } else {
                    expToast("error", "cant push this page!!");
                }
            })
        }
    }

    // getProduct(callback){
    //     let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
    //     if (campaign_id.length === 0) {
    //         expToast("error", "Please input campaign ID!");
    //         return;
    //     }
    // }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let collection_id = null;
        if (document.querySelector(".exp-template .exp-input[name=\"collection_id\"]") && user.id === 1) {
            collection_id = document.querySelector(".exp-template .exp-input[name=\"collection_id\"]").value;
            if (collection_id.length === 0) {
                expToast("error", "Please input collection id!");
                return;
            }
        }
        let url = window.location;
        let search, productUrl;
        if (typeof url.search != "undefined" && typeof url.search !== undefined && url.search !== "" && collection_id === null) {
            search = url.search;
            productUrl = url.origin + '/api/catalog/products_v2.json' + search + '&';
        } else if (url.hostname === 'www.auzaras.com') {
            productUrl = url.origin + '/api/catalog/products_v2.json?';
        } else if (collection_id) {
            productUrl = url.origin + '/api/catalog/products_v2.json' + '?collection_ids=' + collection_id + '&';
        } else {
            expToast("error", "Cant push this page!");
            return;
        }
        let products = [];
        this.subXhrGetProducts(callback, campaign_id, productUrl);
    }

    pushProduct(callback, campaign_id, products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
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
                console.log(data);
                callback(data);
            });
        }
    }

    subXhrGetProducts(callback, campaign_id, productUrl, limit = 50, page = 1, products = []) {
        let that = this;
        chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: productUrl + 'limit=' + limit + '&page=' + page,
            }, function (responseText) {
                let data = JSON.parse(responseText);
                if (data.success !== undefined && !data.success) {
                    console.log(data);
                    expToast("error", data.message);
                    return;
                }
                if (data.products.length > 0) {
                    let temp_products = [];
                    data.products.forEach(function (v, k) {
                        if (typeof v.images == "undefined" || typeof v.images === undefined)
                            return;
                        let banner = v.images[0].src;
                        let images = [];
                        if (v.images.length > 1)
                            v.images.forEach(function (value, key) {
                                images.push(value.src)
                            });
                        temp_products.push({
                            type: "",
                            title: v.title,
                            banner: banner,
                            images: images,
                            item_id: v.handle,
                            tags: v.tags,
                            store: location.host,
                            market: "shopbase",
                        })
                    });
                    if (data.products.length === limit) {
                        products = products.concat(temp_products);
                        setTimeout(function () {
                            return that.subXhrGetProducts(callback, campaign_id, productUrl, limit, ++page, products);
                        }, 5000);
                    } else if (data.products.length < limit) {
                        products = products.concat(temp_products);
                        that.pushProduct(callback, campaign_id, products);
                    } else
                        that.pushProduct(callback, campaign_id, products);
                }
            }
        )
        ;
    }
}
