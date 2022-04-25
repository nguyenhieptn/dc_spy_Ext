let Thebamboo = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        console.log(document.querySelector('.exp-template'))
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('#product-wrapper')) {
                    this.getProduct()
                } else if (document.querySelector('#collection-wrapper')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector(".product-content .pro-content-head h1").innerText.trim();
        let images = [];
        document.querySelectorAll("#product-wrapper .product-gallery__thumbs-container a").forEach(function (v, k) {
            let imgUrl = v.getAttribute('data-variant-image');
            imgUrl = imgUrl.replace('160x200', '2000x2000')
            images.push(imgUrl);
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            source_url: location.origin + location.pathname,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host,
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#collection-wrapper .product-item").forEach((el) => {
                if (el.querySelector(".product-img img")) {
                    let banner = el.querySelector(".product-img img").getAttribute("src");
                    if (banner === undefined) {
                        banner = el.querySelector(".product-media img").getAttribute("data-src");
                    }
                    banner = banner.replace('_large', '')
                    let title = el.querySelector(".product-title a").textContent.trim();
                    let pId = el.querySelector(".product-img a").getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: location.origin + pId,
                        tags: tags,
                        store: location.host,
                        market: location.host
                    };
                    products.push(product);
                }
            }
        );
        this.push(products)
    }
};
