let WooBbTheme = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("body.single-product")) {
                    this.getProduct();
                } else if (document.querySelector('body.archive .fl-post-grid[itemscope="itemscope"]')) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("body.single-product .product_title").innerText;
        let banner = document.querySelector("figure.woocommerce-product-gallery__wrapper div.woocommerce-product-gallery__image > img").getAttribute("src");
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];
        let images = [];
        document.querySelectorAll("figure.woocommerce-product-gallery__wrapper div.woocommerce-product-gallery__image").forEach(function(v, k){
            let img = v.querySelector('a img').getAttribute('srcset');
            img = img.split(', ');
            img = img[img.length-1].split(' ')[0]
            images.push(img);
        });
        images.shift();
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "wooBbTheme"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("body.archive .fl-post-grid .fl-post-column").forEach((el) => {
                let title = el.querySelector("h2.fl-post-grid-title a").innerText;
                let banner = el.querySelector(".fl-post-grid-image img").getAttribute("srcset");
                banner = banner.split(', ');
                banner = banner[banner.length - 1];
                banner = banner.split(' ')[0];
                if (isURL(banner) && banner != null) {
                    let pId = el.querySelector("h2.fl-post-grid-title a").getAttribute("href");
                    pId = new URL(pId);
                    pId = pId.pathname;
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        tags: tags,
                        store: location.host,
                        market: "wooBbTheme",
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
