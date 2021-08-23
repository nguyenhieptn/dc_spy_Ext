let WooPangja = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("body.single-product")) {
                    this.getProduct()
                } else if (document.querySelector("body.archive .products")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("body.single-product h1.product_title").innerText;
        let banner;
        let images = [];
        document.querySelectorAll("body.single-product .single-product-image-inner #product-thumbnails1 div.slick-list div.thumbnail-image").forEach(function (el) {
            let imgs = el.querySelector('a img').getAttribute('srcset');
            imgs = imgs.split(', ');
            imgs = imgs[imgs.length - 1];
            imgs = imgs.split(" ")[0];
            images.push(imgs);
        })
        banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];
        if (document.querySelector('span.tagged_as') !== null) {
            document.querySelectorAll('span.tagged_as a').forEach((e) => {
                tags.push(e.textContent);
            });
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "wooPangja"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("body.archive .products .product").forEach((el) => {
                let title = el.querySelector("h2.woocommerce-loop-product__title").innerText;
                let banner;
                if(el.querySelector(".product-thumb-primary img"))
                {
                    banner = el.querySelector(".product-thumb-primary img").getAttribute("srcset");
                }
                else if(el.querySelector(".product-thumb-one img"))
                {
                    banner = el.querySelector(".product-thumb-one img").getAttribute("srcset");
                }
                banner = banner.split(', ');
                banner = banner[banner.length - 1].split(" ")[0];
                if (isURL(banner) && banner != null) {
                    let pId = el.querySelector(".product-info a").getAttribute("href");
                    pId = new URL(pId);
                    pId = pId.pathname;
                    let tags = [];
                    let images = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        tags: tags,
                        images: [],
                        store: location.host,
                        market: "wooPangja",
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
