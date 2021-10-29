let Trendswanna = class extends Initial {
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
            if (document.querySelector(".ProductPageContainer")) {
                this.getProduct()
            } else if (document.getElementsByClassName('.ListItemsInner')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector(".ProductTitle h1").innerText.trim();
        let images = [];
        let banner = document.querySelector('.ProductImage img').getAttribute('src');
        let pId = location.pathname;
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
            market: "trendswanna"
        };
        console.log(product);
        this.push([product])
    }

    getProducts() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelectorAll('.ListItemsInner .ProductItem')
        containerProducts.forEach((el) => {
            if (el.querySelector('.img-fluid')) {
                let title = el.querySelector('.Title').textContent;
                let banner = el.querySelector('.img-fluid').getAttribute('src');
                banner = banner.replace('thumb', 'regular');
                let images = [];
                let pId = el.querySelector('a.ProductItemInner').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market: "trendswanna",
                };
                products.push(product);
            }
        });
        console.log(products);
        this.push(products);
    }
};
