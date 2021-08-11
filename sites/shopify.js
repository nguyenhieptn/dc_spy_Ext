let Shopify = class extends Initial{
        constructor() {
            super();
            this.domain = location.origin;
            this.href = location.href;
            this.build();
            this.init();
        }

        init() {
            if (document.querySelector('.exp-template') === null) {
                let button = document.querySelector('button.exp-btn-push')
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    button.classList.add("is-loading");
                    if (this.href.indexOf("/products/") !== -1) {
                        this.getProduct()
                    } else if (this.href.indexOf("/collections/") !== -1 || this.href.indexOf("/search") !== -1) {
                        this.getProducts()
                    }
                });
            }
        }

        getDOMProducts() {
            let products = [];
            document.querySelectorAll('.product-wrap').forEach(function (_product) {
                let banner = new URL('https:' + _product.querySelector('.image__container img').getAttribute('src'))
                let pathName = banner.pathname;
                let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
                if (fileName.lastIndexOf('_') !== -1 && fileName.lastIndexOf('.') !== -1) {
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
                    type: "",
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
            if (products.length === 0) {
                expToast("error", "No more product!");
                return;
            }
            this.push(products);
        }

        getProducts() {
            if(location.pathname.indexOf('collections') !== -1)
            {
                let nUrl = location.protocol + location.host + location.pathname + "/products.json";
                this.ajaxLoadProduct(nUrl);
            }
            else
            {
                expToast("error", "Cant push this page (platform Shopify)");
            }
        }

        getProduct() {
            let nUrl = location.protocol + location.host + location.pathname + ".json" + location.search;
            let images = [];
            let that = this;
            chrome.runtime.sendMessage({
                action: 'xhttp',
                method: 'GET',
                url: nUrl,
            }, function (responseText) {
                let _product = JSON.parse(responseText);
                if (_product.product !== undefined)
                    _product = _product.product;
                let _images = _product.images;
                let images = [];
                let banner = _product.image.src;
                let bannerWidth = null;
                if (_product.image.width !== undefined) {
                    bannerWidth = _product.image.width;
                }
                if (_images !== undefined)
                    _images.forEach((_image) => {
                        images.push(_image.src);
                        if (bannerWidth != null && _image.width !== undefined && _image.width > bannerWidth) {
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
                that.pushProduct([product]);
            });
        }

        ajaxLoadProduct(nUrl, page = 1, limit = 50, products = []) {
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
                    if (_images !== undefined)
                        _images.forEach((_image) => {
                            images.push(_image.src);
                            if (_image.width !== undefined && _image.width > bannerWidth) {
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
                    that.pushProduct(products);
                    setTimeout(function () {
                        return that.ajaxLoadProduct(nUrl, ++page, limit, [])
                    }, 1200);
                }
                else if (_products.length === limit) {
                    setTimeout(function () {
                        return that.ajaxLoadProduct(nUrl, ++page, limit, products)
                    }, 1200);
                } else {
                    that.pushProduct(products)
                }

            });
        }

        pushProduct(products) {
            this.push(products);
        }
    }
;
