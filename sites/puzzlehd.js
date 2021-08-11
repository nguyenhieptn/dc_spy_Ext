let Puzzlehd = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        window.onload = function () {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                that.getProducts()
            })
        }
    }

    getProducts() {
        let url = window.location;
        let search, productUrl, startId = null;
        if (url.pathname.includes('search')) {
            let query = url.pathname.split("/");
            if (typeof query[query.indexOf("search") + 1] != "undefined") {
                search = 'term=' + query[query.indexOf("search") + 1];
            }
            if(window.location.search.indexOf('startId=') !== -1)
            {
                startId = window.location.search.replace('?startId=', "");
                console.log(startId);
            }
            productUrl = url.origin + '/api/product/v3/products/search?' + search + '&startId='+startId+"&";
        } else
            productUrl = url.origin + '/api/product/v3/products?';
        this.subXhrGetProducts(productUrl);

    }

    pushProduct(products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            this.push(products);
        }
    }

    subXhrGetProducts(productUrl, limit = 50, page = 1, products = []) {
        let that = this;
        chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: productUrl + 'limit=' + limit + '&page=' + page,
            }, function (responseText) {
                let res_data = JSON.parse(responseText);
                let data = res_data.data;
                let data_products = data.products;
                if (data_products.length > 0 && res_data.success) {
                    let temp_products = [];
                    data_products.forEach(function (v, k) {
                        let banner = v.thumbnail;
                        let images = [];
                        if (typeof v.images != "undefined")
                            if (v.images.length > 1)
                                v.images.forEach(function (value, key) {
                                    images.push(value.src)
                                });
                        temp_products.push({
                            type: type,
                            title: v.title,
                            banner: banner,
                            images: images,
                            item_id: v.slug,
                            tags: v.tags,
                            store: location.host,
                            market: 'sbsdk'
                        })
                    });
                    if (data_products.length === limit) {
                        products = products.concat(temp_products);
                        setTimeout(function () {
                            return that.subXhrGetProducts(productUrl, limit, ++page, products);
                        }, 5000);
                    } else if (data_products.length < limit) {
                        products = products.concat(temp_products);
                        that.pushProduct(products);
                    } else
                        that.pushProduct(products);
                }
            }
        )
        ;
    }
}
