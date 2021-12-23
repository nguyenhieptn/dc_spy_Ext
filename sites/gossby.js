let Gossby = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build()
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (location.pathname.indexOf("product") !== -1) {
                this.getProduct()
            } else if (document.querySelector('h1[class*="ProductCollection_banner-name"]')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector("h1").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('div[class*="ProductGallery_col-slide-img"] img').forEach(function (image) {
            images.push(image.getAttribute('src'));
        });
        banner = images.shift();
        let pId = location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            source_url: location.href,
            images: images,
            store: location.host,
            market: location.host,
        };
        console.log(product);
        this.push([product])
    }

    getProducts() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelector('h1[class*="ProductCollection_banner-name"]').parentElement.querySelectorAll('div.flex > div')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('img').getAttribute('alt');
                let banner = el.querySelector('img').getAttribute('src');
                let images = [];
                let pId = el.querySelector('a').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    source_url: location.origin+pId,
                    tags: tags,
                    store: location.host,
                    market: location.host,
                };
                products.push(product);
            }
        });
        console.log(products);
        this.push(products);
    }
};
