let Shopify = class {
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
                    if (this.href.indexOf("/products/") !== -1) {
                        this.getProduct((data) => {
                            button.classList.remove("is-loading");
                            if (data.status === "succeed") {
                                expToast("success", "Push Successfully!");
                            } else {
                                expToast("error", data.msg);
                            }
                        })
                    } else if (this.href.indexOf("/collections/") !== -1 || this.href.indexOf("/search") !== -1) {
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

        getDOMProducts(callback, type, campaign_id) {
            let products = [];
            document.querySelectorAll('.product-wrap').forEach(function (_product) {
                let banner = new URL('https:' + _product.querySelector('.image__container img').getAttribute('src'))
                let pathName = banner.pathname;
                console.log(pathName);
                let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
                if (fileName.lastIndexOf('_') != -1 && fileName.lastIndexOf('.') != -1) {
                    fileName = fileName.slice(0, fileName.lastIndexOf('_')) + fileName.slice(fileName.lastIndexOf('.'), fileName.length);
                    pathName = pathName.substring(0, pathName.lastIndexOf('/') + 1);
                    banner = banner.origin + pathName + fileName;
                } else {
                    console.log(_product);
                    banner = banner.origin + banner.pathname;
                }
                console.log(banner);
                let itemId = new URL(window.location.origin + _product.querySelector('a').getAttribute('href'))
                itemId = itemId.pathname.substring(itemId.pathname.lastIndexOf('/') + 1)
                let title = _product.querySelector('.hidden-product-link').textContent
                let product = {
                    type: type,
                    title: title,
                    banner: banner,
                    images: [],
                    item_id: itemId,
                    tags: [],
                    store: location.host,
                    market: "shopify"
                };
                products.push(product);
            })
            console.log(products);
            if (products.length == 0) {
                expToast("error", "No more product!");
                return;
            }
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

        getProducts(callback) {
            let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
            if (campaign_id.length === 0) {
                expToast("error", "Please input campaign ID!");
                return;
            }
            if(location.pathname.indexOf('collections') !== -1)
            {
                let nUrl = location.protocol + location.host + location.pathname + "/products.json";
                this.ajaxLoadProduct(callback, campaign_id, nUrl);
            }
            else
            {
                expToast("error", "Cant push this page (platform Shopify)");
            }
            // if (window.location.pathname.indexOf('search') !== -1) {
            //     expToast("error", "Cant push this page (platform Shopify)");
            //     return this.getDOMProducts(callback, type, campaign_id);
            // }
        }

        getProduct(callback) {
            let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
            if (campaign_id.length === 0) {
                expToast("error", "Please input campaign ID!");
                return;
            }
            let nUrl = location.protocol + location.host + location.pathname + ".json" + location.search;
            let images = [];
            let that = this;
            chrome.runtime.sendMessage({
                action: 'xhttp',
                method: 'GET',
                url: nUrl,
            }, function (responseText) {
                let _product = JSON.parse(responseText);
                if (_product.product != undefined)
                    _product = _product.product;
                let _images = _product.images;
                let images = [];
                let banner = _product.image.src;
                let bannerWidth = null;
                if (_product.image.width != undefined) {
                    bannerWidth = _product.image.width;
                }
                if (_images != undefined)
                    _images.forEach((_image) => {
                        images.push(_image.src);
                        if (bannerWidth != null && _image.width != undefined && _image.width > bannerWidth) {
                            banner = _image.src;
                            bannerWidth = _image.width;
                        }
                    });
                let product = {
                    type: "",
                    title: _product.title,
                    banner: banner,
                    images: images,
                    item_id: _product.handle,
                    tags: [],
                    store: location.host,
                    market: "shopify"
                };
                console.log(product);
                that.pushProduct(callback, [product], campaign_id);
            });
        }

        ajaxLoadProduct(callback, campaign_id, nUrl, page = 1, limit = 50, products = []) {
            let that = this;
            console.log(nUrl + "?page=" + page + "&limit=" + limit);
            chrome.runtime.sendMessage({
                action: 'xhttp',
                method: 'GET',
                url: nUrl + "?page=" + page + "&limit=" + limit,
            }, function (responseText) {
                console.log(responseText);
                let data = JSON.parse(responseText);
                let _products = data.products;
                _products.forEach((_product) => {
                    let _images = _product.images;
                    let images = [];
                    let banner = null;
                    let bannerWidth = 0;
                    if (_images != undefined)
                        _images.forEach((_image) => {
                            images.push(_image.src);
                            if (_image.width != undefined && _image.width > bannerWidth) {
                                banner = _image.src;
                                bannerWidth = _image.width;
                            }
                        });
                    let product = {
                        type: "",
                        title: _product.title,
                        banner: banner,
                        images: images,
                        item_id: _product.handle,
                        tags: _product.tags,
                        store: location.host,
                        market: "shopify"
                    };
                    products.push(product);
                });
                if(products.length >= 300 && _products.length === limit)
                {
                    that.pushProduct(callback, products, campaign_id);
                    setTimeout(function () {
                        return that.ajaxLoadProduct(callback, campaign_id, nUrl, ++page, limit, [])
                    }, 1200);
                }
                else if (_products.length === limit) {
                    setTimeout(function () {
                        return that.ajaxLoadProduct(callback, campaign_id, nUrl, ++page, limit, products)
                    }, 1200);
                } else {
                    that.pushProduct(callback, products, campaign_id)
                }

            });
        }

        pushProduct(callback, products, campaign_id) {
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
    }
;