let Chaest = class extends Initial {
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
            if (document.querySelector('div.ProductPageContainer')) {
                this.getProduct();
            } else if (document.querySelectorAll('.ProductItem').length > 0) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('div.ProductPageContainer');
        let title = container.querySelector('.ProductTitle h1').innerText.trim();
        let banner;
        let images = [];
        banner = document.querySelector('div.ProductImage img').getAttribute('src');
        let pId = null;
        pId = location.pathname;
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
            market: location.host
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".ProductItem").forEach((el) => {
                    let title = el.querySelector('img').getAttribute('alt');
                    let banner = el.querySelector('img').getAttribute("src");
                    banner = banner.replace('thumb', 'regular')
                    let pId =  el.querySelector('a.ProductItemInner').getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
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
