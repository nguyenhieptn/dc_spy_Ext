let ShirtStore = class extends Initial{
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
                if (document.querySelector("body.product-page")) {
                    this.getProduct()
                } else if (document.querySelector("body.category-page")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("body.product-page h1.product-page-header").innerText;
        let banner = document.querySelector("body.product-page .product-images img#FrontImage").getAttribute('src');
        let images = [];
        banner = location.host+banner;
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
            market: "shirtStore"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("body.category-page .product-wrappers article.product-wrapper").forEach((el) => {
            console.log( el.querySelector(".product-info .product-name"));
                let title = el.querySelector(".product-info .product-name h3").innerText;
                let banner = el.querySelector(".product-image a img").getAttribute('src');
                banner = banner.replace('medium', 'large');
                banner = location.origin + banner;
                if (isURL(banner) && banner != null) {
                    let pId = el.querySelector(".product-info .product-name h3 a").getAttribute("href");
                    let tags = [];
                    let images = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        tags: tags,
                        images: images,
                        store: location.host,
                        market: "shirtStore",
                    };
                    console.log(product);
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
