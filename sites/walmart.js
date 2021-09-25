let Walmart = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (window.location.pathname.indexOf('search') !== -1) {
                that.getProducts()
            } else if (document.querySelector('div[data-testid="add-to-cart-section"]')) {
                that.getProduct();
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".pa0-xl").forEach((el) => {
            let elm = el;
            let banner = elm.querySelector('img[data-testid="productTileImage"]').getAttribute('src');
            let images = [];
            if (!isURL(banner)) {
                return;
            } else {
                banner = new URL(banner);
                banner = banner.origin+banner.pathname;
            }
            let title = elm.querySelector('span.lh-title').innerText.trim();
            let pId = el.querySelector("a").getAttribute('link-identifier');
            let tags = [];
            let store = "walmart";
            let product = {
                title: title,
                banner: banner,
                images: images,
                item_id: pId,
                tags: tags,
                store: store,
                market: "walmart"
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }

    getProduct() {
        let title = document.querySelector('h1[itemprop="name"]').innerText;
        let store = "walmart";
        let pId = location.pathname.split('/');
        pId = pId[pId.length-1];
        let images = [];
        if (document.querySelectorAll('div[data-testid="vertical-carousel-container"] > .tc').length > 0)
            document.querySelectorAll('div[data-testid="vertical-carousel-container"] > .tc').forEach(function (el) {
                let image = new URL(el.querySelector('img').getAttribute("src"));
                image = image.origin+image.pathname;
                images.push(image);
            });
        else {
            expToast("error", "Error crawl images!");
            return;
        }
        let banner = images.shift();
        let type = "";
        let product = {
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "walmart"
        };
        console.log(product);
        this.push([product])
    }
};
