let Tee4lives = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('body.page-type-product')) {
                    this.getProduct()
                } else if (document.querySelector('.category-page')) {
                    expToast("error", 'Cant crawl this page!');
                    // this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.productView-title").innerText;
        let images = [];
        document.querySelectorAll("ul.productView-imageCarousel-nav li img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace("100x100", "1500x1500");
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
        let elm = document.querySelector("ul.elementor-post-info");
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            source_url: location.href,
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
        document.querySelectorAll("#usstore-products .product-list").forEach((el) => {
                let title = el.querySelector(".product-image a.goos-tag-product").getAttribute('title');
                if (el.querySelector(".product-image a.goos-tag-product")) {
                    let banner = el.querySelector(".product-image a.goos-tag-product img").getAttribute("data-src");
                    banner = banner.replace('US218', "");
                    let pId = new URL(el.querySelector(".product-image a.goos-tag-product").getAttribute('href'));
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId.pathname,
                        tags: tags,
                        store: location.host,
                        market: "ubuy"
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products)
    }
};
