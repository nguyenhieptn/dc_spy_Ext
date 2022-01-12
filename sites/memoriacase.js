let Memoriacase = class extends Initial {
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
            if (document.querySelector(".product-detail")) {
                this.getProduct();
            } else if (location.pathname.search("search") !== -1 || document.querySelector('.collection__container')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector(".product-info__header_title").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('.product-image__thumbs-content img').forEach(function (image) {
            let imgUrl = image.getAttribute('data-src');
            imgUrl = imgUrl.replace('100x', '1500x');
            images.push(imgUrl);
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
        containerProducts = document.querySelectorAll('.serial-item')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.getAttribute('data-track-name');
                let banner = el.querySelector('.product-snippet__img-wrapper img').getAttribute('srcset');
                banner = banner.split(',')[0];
                banner = banner.split(' ')[0];
                banner = banner.replace('360x', '1500x');
                console.log(banner);
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
