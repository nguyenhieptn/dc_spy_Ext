let Prezzybox = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    host = DataCenter;
    token = token;

    init() {
        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (document.querySelector("body.product-page")) {
                button.classList.add("is-loading");
                that.getSingleProduct()
            } else if (typeof window.ecomm_pagetype !== "undefined" && (ecomm_pagetype === "search" || ecomm_pagetype === "category")) {
                button.classList.add("is-loading");
                that.getProducts();
            } else
                expToast("error", "Cant crawl this page!");
        })
    }

    getProduct() {
        let dataProduct = window.globalCampaign;
        let product = {
            type: "",
            images: [],
            tags: dataProduct.tags,
            item_id: '/' + dataProduct.path,
            title: dataProduct.name,
            banner: dataProduct.featured.mockupUrl,
            store: location.host,
            market: "store_front",
        }
        this.pushProducts([product]);
    }

    getProducts() {
        if (window.ecomm_pagetype === "search") {
            this.getProductsInSearchPage();
        } else if (window.ecomm_pagetype === "category") {
            this.getProductsInCollectionPage();
        } else {
            expToast("error", "cant push this page!!");
        }
    }

    getSingleProduct() {
        let url = "https://www.prezzybox.com/api/product/getsummary/";
        let productJson = JSON.parse(document.querySelector('script[type="application/ld+json"]').text);
        if (productJson) {
            let sku = productJson.sku;
            url = url + sku + '?';
            this.apiGetProducts(url);
        } else {
            expToast('error', 'Cant push this page!');
        }
    }

    getProductsInSearchPage() {
        let url = window.location;
        let key = null;
        if (window.globalStore !== undefined) {
            key = window.globalStore.key;
        }
        if (key) {

            let query = new URL(window.location.href);
            query = query.searchParams.get('q');
            let productUrl = url.origin + '/api/stores/' + key + '/campaigns/searchv2?query=' + query + '&sortBy=name&';
            this.apiGetProducts(productUrl, 40, 0, true);
        } else {
            expToast("error", "Cant push this page!");
            return;
        }
    }

    getProductsInCollectionPage() {
        let url = window.location;
        let key = null;
        if (window.globalStorefrontJson !== undefined) {
            key = window.globalStorefrontJson.key;
        }
        if (key) {
            let productUrl = url.origin + '/api/storefrontpage/' + key + '/campaigns?';
            this.apiGetProducts(productUrl, 40, 0, false);
        } else {
            expToast("error", "Cant push this page!");
            return;
        }

    }

    apiGetProducts(productUrl, limit = 40, page = 0, search = false, products = []) {
        let that = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let res = JSON.parse(xhttp.responseText);
            console.log(res);
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
                            market: "prezzybox",
                        })
                    });
                    products = products.concat(temp_products);
                    if (res.more) {
                        setTimeout(function () {
                            return that.apiGetProducts(productUrl, limit, ++page, search, products);
                        }, 3000);
                    }
                }
            } else if (res.Title) {
                let images = res.Images.map(image => image.Url);
                let banner = images.shift();
                let product = {
                    type: "",
                    title: res.Title,
                    banner: banner,
                    images: images,
                    item_id: res.id,
                    tags: [],
                    store: location.host,
                    market: "prezzybox",
                }
                this.pushProducts([product]);
            } else {
                expToast("error", "Products not found!");
            }
            xhttp.onerror = function () {
                console.log(xhttp);
                expToast(xhttp.responseText.error);
            };
            xhttp.open("GET", productUrl + 'cursor=' + page + '&limit=' + limit, true);
            xhttp.send();
        }
    }

    pushProducts(products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            this.pushInject(products)
        }
    }

}

new Prezzybox();

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
