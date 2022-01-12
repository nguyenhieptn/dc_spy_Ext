let Crosfil = class extends Initial {
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
            if (location.pathname.indexOf("products") !== -1) {
                this.getProduct()
            } else if (location.pathname.search("search") !== -1 || document.querySelector('.category-title')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector("div.listing-info > div > div").innerText.trim();
        let images = [];
        let banner;
        document.querySelectorAll('.product-images .left img').forEach(function (image) {
            let imgUrl = image.getAttribute('src');
            imgUrl = imgUrl.replace('75xauto', '1500xauto');
            console.log(imgUrl);
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
        containerProducts = document.querySelectorAll('a.d-product')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('.image img').getAttribute('alt');
                let banner = el.querySelector('.image img').getAttribute('src');
                banner = banner.replace('412xauto', '1500xauto');
                let images = [];
                let pId = el.getAttribute('href');
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
