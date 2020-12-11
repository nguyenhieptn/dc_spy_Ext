let StoreFront = class {
    constructor() {
        this.domain = location.origin;
        this.init();
    }

    host = document.querySelector('#exp-embed').getAttribute('data-host');
    token = document.querySelector('#exp-embed').getAttribute('data-token');

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
        button.setAttribute('type', 'button');
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(typeof window.globalCampaign !== "undefined");
            if (typeof window.globalCampaign !== "undefined") {
                button.classList.add("is-loading");
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (typeof window.ecomm_pagetype !== "undefined" && (ecomm_pagetype === "search" || ecomm_pagetype === "category")) {
                button.classList.add("is-loading");
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else
                expToast("error", "Cant crawl this page!");
        })
    }

    getProduct(cb) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let dataProduct = window.globalCampaign;
        let product = {
            type: "",
            images: [],
            tags: dataProduct.tags,
            item_id: '/'+dataProduct.path,
            title: dataProduct.name,
            banner: dataProduct.featured.mockupUrl,
            store: location.host,
            market: "store_front",
        }
        this.pushProducts(cb, campaign_id, [product]);
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        if (window.ecomm_pagetype === "search") {
            this.getProductsInSearchPage(callback, campaign_id);
        } else if (window.ecomm_pagetype === "category") {
            this.getProductsInCollectionPage(callback, campaign_id);
        } else {
            expToast("error", "cant push this page!!");
        }
    }

    getProductsInSearchPage(callback, campaign_id) {
        let url = window.location;
        let key = null;
        if (window.globalStore !== undefined) {
            key = window.globalStore.key;
        }
        if (key) {

            let query = new URL(window.location.href);
            query = query.searchParams.get('q');
            let productUrl = url.origin + '/api/stores/' + key + '/campaigns/searchv2?query=' + query + '&sortBy=name&';
            this.apiGetProducts(callback, campaign_id, productUrl, 40, 0, true);
        } else {
            expToast("error", "Cant push this page!");
            return;
        }
    }

    getProductsInCollectionPage(callback, campaign_id) {
        let url = window.location;
        let key = null;
        if (window.globalStorefrontJson !== undefined) {
            key = window.globalStorefrontJson.key;
        }
        if (key) {
            let productUrl = url.origin + '/api/storefrontpage/' + key + '/campaigns?';
            this.apiGetProducts(callback, campaign_id, productUrl,40, 0, false);
        } else {
            expToast("error", "Cant push this page!");
            return;
        }

    }

    apiGetProducts(callback, campaign_id, productUrl, limit = 40, page = 0, search = false, products = []) {
        let that = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let res = JSON.parse(xhttp.responseText);
            if (res.hasOwnProperty('results')) {
                if (res.results.length > 0) {
                    let resProducts = res.results;
                    let temp_products = [];
                    resProducts.forEach(function (v, k) {
                        let banner = v.mockupUrlSmall;
                        banner = new URL(banner);
                        console.log(banner);
                        banner.searchParams.delete('ms');
                        let images = [];
                        temp_products.push({
                            type: "",
                            title: v.name,
                            banner: banner.href,
                            images: images,
                            item_id: '/' + v.path,
                            tags: v.tags,
                            store: location.host,
                            market: "store_front",
                        })
                    });
                    products = products.concat(temp_products);
                    if (res.more) {
                        setTimeout(function () {
                            return that.apiGetProducts(callback, campaign_id, productUrl, limit, ++page, search, products);
                        }, 3000);
                    } else {
                        that.pushProducts(callback, campaign_id, products);
                    }
                } else {
                    expToast("error", "Products not found!");
                }
            } else {
                console.log(xhttp);
                expToast("error", JSON.parse(xhttp.responseText).error);
            }
        };
        xhttp.onerror = function () {
            console.log(xhttp);
            expToast(xhttp.responseText.error);
        };
        if (search)
            xhttp.open("GET", productUrl + 'skip=' + (page * limit) + '&limit=' + limit, true);
        else
            xhttp.open("GET", productUrl + 'cursor=' + page + '&limit=' + limit, true);
        xhttp.send();
    }

    pushProducts(callback, campaign_id, products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            let xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                callback(JSON.parse(xhttp.responseText));
            };
            xhttp.onerror = function () {
                callback(JSON.parse(xhttp.responseText));
            };
            xhttp.open("POST", '//' + this.host + "/api/campaigns/products", true);
            xhttp.setRequestHeader("token", this.token);
            xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhttp.send(JSON.stringify({
                products: products,
                campaign_id: campaign_id
            }));
        }
    }

}
new StoreFront();

function expToast(type, msg) {
    console.log(type, msg);
    let x = document.getElementById("exp-snackbar");
    x.innerText = msg;
    x.className = "";
    x.classList.add("show");
    x.classList.add(type);
    setTimeout(function () {
        x.className = "";
    }, 3000);
}
