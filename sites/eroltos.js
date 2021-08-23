let Eroltos = class extends Initial{
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
                if (document.querySelector("#description_panel")) {
                    console.log('dvh');
                    this.getProduct()
                } else if (location.pathname.indexOf('products') || location.pathname.indexOf('collection')) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct(callback) {
        let title = document.querySelector('meta[name="title"]').getAttribute('content');
        let banner = null;
        banner = document.querySelector('.product-display div div:last-child div').style.backgroundImage.slice(4, -1).replace(/"/g, "");
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];

        let images = [];
        console.log(images, banner);
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "eroltos"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts(callback) {
        let products = [];
        document.querySelectorAll("#content .container .w-full .relative .product-group-product").forEach((el) => {
                let title = el.querySelector("a img ").getAttribute('alt');
                if (el.querySelector("a img") !== null) {
                    let banner = el.querySelector("a img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        let url = new URL(banner);
                        banner = url.href;
                        console.log(el);
                        let pId = el.getAttribute("href");
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "eroltos"
                        };
                        products.push(product);
                    }
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
