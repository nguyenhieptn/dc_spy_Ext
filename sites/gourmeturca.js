let Gourmeturca = class extends Initial {
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
            if (document.querySelector('#productDetail')) {
                this.getProduct();
            } else if (document.querySelector('div.catalogWrapper')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('#productDetail');
        let title = container.querySelector('#productName').innerText.trim();
        let banner = container.querySelector('span.imgInner img').getAttribute('src');
        let images = [];
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        let containerProducts;
        if (document.querySelector('.SearchPageContainer'))
            containerProducts = document.querySelectorAll('.SearchPageContainer > div')
        else
        {
            containerProducts = document.querySelectorAll('.catalogWrapper .productItem')
        }
        containerProducts.forEach((el) => {
                if(el.querySelector('span.imgInner img') == null) return false;
                let title = el.querySelector('span.imgInner img').getAttribute('alt');
                let banner = el.querySelector('span.imgInner img').getAttribute('src');
                let images = [];
                let pId = el.querySelector('a.detailLink').getAttribute('href');
                let tags = [];
                let product = {
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market: location.host
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
