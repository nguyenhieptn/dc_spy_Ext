let Wix = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('div[data-hook="product-page"]')) {
                this.getProduct();
            } else if (document.querySelector('section[data-hook="product-list"]')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('div[data-hook="product-page"]');
        let title = container.querySelector('[data-hook="product-title"]').innerText.trim();
        let banner = new URL(container.querySelector('img[data-hook="product-image"]').getAttribute('src'));
        banner = banner.origin + banner.pathname.split('/').slice(0, 3).join("/");
        let images = [];
        let pId = null;
        pId = location.origin+location.pathname;
        if (!pId) return;
        let tags = [];
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "WIx"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelectorAll('section[data-hook="product-list"] ul[data-hook="product-list-wrapper"] li[data-hook="product-list-grid-item"]')
        containerProducts.forEach((el) => {
                let title = el.querySelector('img[data-hook="wix-media-image"]').getAttribute('alt').trim();
                let banner = new URL(el.querySelector('img[data-hook="wix-media-image"]').getAttribute('src'));
                banner = banner.origin + banner.pathname.split('/').slice(0, 3).join("/");
                let images = [];
                let pId = el.querySelector('a[data-hook="product-item-container"]').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market: "WIx"
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
