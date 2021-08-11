let Society6 = class extends Initial{
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
                if (document.querySelector('#product')) {
                    this.getProduct()
                } else {
                    expToast("error", 'Cant crawl this page!');
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector('#product #detailsProductType').innerText;
        let banner = new URL(document.querySelector('#product .slick-list img').getAttribute('src'));
        banner = banner.origin + banner.pathname;
        let images = [];
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
        this.push(product);
    }

    getProducts() {
        let products = [];
        if (document.querySelector('#results-products ul')) {
            document.querySelectorAll('#results-products ul li.grid-tile').forEach((el) => {
                    let title = el.querySelector(".product-image a.thumb-link").getAttribute('title');
                    let images = [];
                    el.querySelectorAll('picture').forEach((ele) => {
                        let _img = ele.querySelector('img').getAttribute('src');
                        if (_img.indexOf('productTileDesktop')) {
                            images.push(_img.replace('productTileDesktop', 'productMainDesktop'));
                        }
                    })
                    if (images.length > 0) {
                        let banner = images.shift();
                        if (isURL(banner) && banner != null) {
                            let pId = new URL(el.querySelector(".product-image a.thumb-link").getAttribute('href'));
                            pId = pId.pathname;
                            let tags = [];
                            let product = {
                                type: "",
                                title: title,
                                banner: banner,
                                images: images,
                                item_id: pId,
                                tags: tags,
                                store: location.host,
                                market: location.host
                            };
                            products.push(product);
                        }
                    }
                }
            );
        }
        console.log(products);
        this.push(products);
    }
};
