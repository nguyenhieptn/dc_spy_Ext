let Printfuns = class extends Initial {
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
            if (document.querySelector("#shopify-section-product-template")) {
                this.getProduct()
            } else if (document.getElementsByClassName('.list-view-items')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector(".product-single__meta h2").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('#p-sliderproduct img').forEach(function (image) {
            images.push(image.getAttribute('data-src='));
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
        containerProducts = document.querySelectorAll('.list-view-items > div > div')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('img').getAttribute('alt');
                let banner = el.querySelector('img').getAttribute('data-src');
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
