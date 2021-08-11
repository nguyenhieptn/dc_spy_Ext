let WooShopTimizer = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
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
        let title = document.querySelector("body.single-product .product_title").innerText;
        let banner = document.querySelector("img[data-large_image]").getAttribute("data-large_image");
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let elm = document.querySelector("[data-content_category]");
        let tags = [];
        if (elm) {
            tags = JSON.parse(elm.getAttribute("data-content_category"));
        }
        if (tags.length === 0) {
            if (document.querySelector('span.tagged_as') !== null) {
                document.querySelectorAll('span.tagged_as a').forEach((e) => {
                    tags.push(e.textContent);
                });
            }
        }

        let images = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "wooShopTimizer"
        };
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("body.archive .products .product").forEach((el) => {
                let title = el.querySelector(".woocommerce-loop-product__title a").innerText;
                if (el.querySelector(".woocommerce-image__wrapper") !== null) {
                    let banner = el.querySelector(".woocommerce-image__wrapper a img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        banner = banner.substr(0, banner.lastIndexOf("-"));
                        banner = banner + ext;
                        let pId = el.querySelector(".woocommerce-loop-product__title a").getAttribute("href");
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
                            market: "wooShopTimizer"
                        };
                        products.push(product);
                    }
                }
            }
        );
        this.push(products);
    }
};
