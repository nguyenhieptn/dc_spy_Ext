let Rightjake = class extends Initial {
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
            if (document.querySelector(".product")) {
                this.getProduct()
            } else if (document.getElementsByClassName('.product-list')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector("h3.title").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('.gallery-thumbs img').forEach(function (image) {
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
        containerProducts = document.querySelectorAll('.product-list ul li')
        containerProducts.forEach((el) => {
            if (el.querySelector('.img-wrapper img')) {
                let title = el.querySelector('.img-wrapper img').getAttribute('alt').textContent;
                let banner = el.querySelector('.img-wrapper img').getAttribute('data-original');
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
