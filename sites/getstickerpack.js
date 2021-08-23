let Getstickerpack = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push')
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('#stickerPack')) {
                this.getProducts()
            }
        });
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#stickerPack img").forEach((el) => {
            let banner = el.getAttribute('data-src-large');
            console.log(banner)
            if (!isURL(banner)) return;
            banner = new URL(banner);
            let item_id = location.href+';'+banner.pathname;
            banner = banner.origin+banner.pathname;
            let title = el.getAttribute('alt');
            let product = {
                type: "",
                title: title,
                banner: banner,
                item_id: item_id,
                tags: [],
                store: location.host,
                market: location.host,
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }
};
