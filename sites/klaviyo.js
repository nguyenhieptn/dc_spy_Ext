let Klaviyo = class {
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
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.getElementById('search') || (document.getElementById('collection'))) {
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (document.getElementById('product')) {
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    console.log(data);
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else {
                expToast("error", "cant push this page!!");
            }
        })
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        if (window.hasOwnProperty('sb_product')) {
            let productId = window.sb_product.id;
            let productUrl = window.location.origin + '/api/catalog/products_v2.json?ids=' + productId;
            let xhttp = new XMLHttpRequest();
            let that = this;
            xhttp.onload = function () {
                let res = JSON.parse(xhttp.responseText);
                if (res.hasOwnProperty('products')) {
                    if (res.products.length > 0) {
                        let products = res.products;
                        let banner = products[0].images[0].src;
                        let images = [];
                        if (products[0].images.length > 1)
                            products[0].images.forEach(function (value, key) {
                                images.push(value.src)
                            });
                        let product = {
                            type: "",
                            title: products[0].title,
                            banner: banner,
                            images: images,
                            item_id: products[0].handle,
                            tags: products[0].tags,
                            store: location.host,
                            market: "shopbase",
                        }
                        that.pushProducts(callback, campaign_id, [product]);
                    } else {
                        expToast("error", "Product not found!");
                    }
                } else {
                    console.log(JSON.parse(xhttp.responseText));
                    expToast("error", JSON.parse(xhttp.responseText).error);
                }
            };
            xhttp.onerror = function () {
                console.log(xhttp);
                expToast(xhttp.responseText.error);
            };
            xhttp.open("GET", productUrl, true);
            xhttp.send();
        } else {
            expToast("error", "cant find product in this page!!");
        }
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        if (document.getElementById('search')) {
            this.getProductsInSearchPage(callback, campaign_id);
        } else if (document.getElementById('collection')) {
            this.getProductsInCollectionPage(callback, campaign_id);
        } else {
            expToast("error", "cant push this page!!");
        }
    }

    getProductsInCollectionPage(callback, campaign_id)
    {
        let url = window.location;
        let collection_id = null;
        if(window.__INITIAL_STATE__.collection.collection.id !== undefined)
        {
            collection_id = window.__INITIAL_STATE__.collection.collection.id;
        }
        if(collection_id)
        {
            let productUrl = url.origin + '/api/catalog/products_v2.json' + '?collection_ids=' + collection_id + '&';
            this.apiGetProducts(callback, campaign_id, productUrl);
        }
        else{
            expToast("error", "Cant push this page!");
            return ;
        }
    }
    getProductsInSearchPage(callback, campaign_id) {
        let url = window.location;
        let search, productUrl;
        if (typeof url.search != "undefined" && typeof url.search !== undefined && url.search !== "") {
            search = url.search;
            productUrl = url.origin + '/api/catalog/products_v2.json' + search + '&';
        } else if (url.hostname === 'www.auzaras.com') {
            productUrl = url.origin + '/api/catalog/products_v2.json?';
        } else {
            expToast("error", "Cant push this page!");
            return ;
        }
        this.apiGetProducts(callback, campaign_id, productUrl);
    }

    apiGetProducts(callback, campaign_id, productUrl, limit = 50, page = 1, products = [])
    {
        let that = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let res = JSON.parse(xhttp.responseText);
            if (res.hasOwnProperty('products')) {
                if (res.products.length > 0) {
                    let resProducts = res.products;
                    let temp_products = [];
                    resProducts.forEach(function (v, k) {
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
                    products = products.concat(temp_products);
                    if (resProducts.length === limit) {
                        setTimeout(function () {
                            return that.apiGetProducts(callback, campaign_id, productUrl, limit, ++page, products);
                        }, 5000);
                    } else
                        that.pushProducts(callback, campaign_id, products);
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
        xhttp.open("GET", productUrl+ 'limit=' + limit + '&page=' + page, true);
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
            // chrome.runtime.sendMessage({
            //     action: 'xhttp',
            //     method: 'POST',
            //     url: DataCenter + "/api/campaigns/products",
            //     headers: {
            //         token: token
            //     },
            //     data: JSON.stringify({
            //         products: products,
            //         campaign_id: campaign_id
            //     })
            // }, function (responseText) {
            //     let data = JSON.parse(responseText);
            //     console.log(data);
            //     callback(data);
            // });
        }
    }
}
new Klaviyo();

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