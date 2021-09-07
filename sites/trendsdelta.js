let Trendsdelta = class extends Initial {
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
            if (document.querySelector('.ProductPageContainer')) {
                this.getProduct();
            } else if (document.querySelector('.ShopPageContainer') || document.querySelector('.SearchPageContainer')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('.ProductPageContainer');
        let title = container.querySelector('.ProductTitle h1').innerText.trim();
        let banner = container.querySelector('img.img-fluid').getAttribute('src');
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
        let containerProducts;
        if (document.querySelector('.SearchPageContainer'))
            containerProducts = document.querySelectorAll('.SearchPageContainer .ListProducts > div')
        else
        {
            containerProducts = document.querySelectorAll('.ShopPageContainer .ListItemsInner > div')
        }
        containerProducts.forEach((el) => {

                let title = el.querySelector('.Title').textContent.trim();
                let banner = el.querySelector('div.Image');
                banner = banner.currentStyle || window.getComputedStyle(banner, false)
                banner = banner.backgroundImage.slice(4, -1).replace(/"/g, "").replace('thumb', 'regular');
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
                    market: location.host
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
