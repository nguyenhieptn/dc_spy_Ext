let Bestsuts = class extends Initial {
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
            if (document.querySelector("#productinfoBody")) {
                this.getProduct()
            } else if (document.querySelector('.centerBoxContentsProducts')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector("#productName").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('#productMoreImages ul li img').forEach(function (image) {
            images.push(image.getAttribute('src'));
        })
        banner = images.shift();
        let pId = location.origin+location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host
        };
        console.log(product);
        this.push([product])
    }

    getProducts() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelectorAll('.centerBoxContentsProducts')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('.prod-name').textContent.trim();
                let banner = el.querySelector('img').getAttribute('data-src');
                banner = banner.replace('thumb', 'regular');
                let pId = el.querySelector('a').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market:  location.host,
                };
                products.push(product);
            }
        });
        console.log(products);
        this.push(products);
    }
};
