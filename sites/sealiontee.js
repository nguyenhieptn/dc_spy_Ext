let Sealiontee = class extends Initial {
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
            if (document.querySelector('.listingpage')) {
                this.getProduct();
            } else if (document.querySelector('.collection-content') || document.querySelector('.search-content')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('.listingpage');
        let title = container.querySelector('h4.listing-header__title').innerText.trim();
        let banner;
        let images = [];
        document.querySelectorAll('.listing-gallery-menu img').forEach(function (el, k) {
            let imageUrl = el.getAttribute('src');
            imageUrl = imageUrl.replace('60/60', '1200/1200');
            images.push(imageUrl);
        });
        banner = images.shift();
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
        containerProducts = document.querySelectorAll('.product-tile-grid > div.product-tile')
        containerProducts.forEach((el) => {
                if (el.querySelector('div.product-tile-image')) {
                    let title = el.querySelector('.product-tile-title').textContent.trim();
                    let banner;
                    let images = [];
                    el.querySelectorAll(".product-tile-image div").forEach(function (el) {
                        let img = el.style.backgroundImage.slice(4, -1).replace(/"/g, "");
                        img = img.replace("560/560", "1200/1200");
                        console.log(img);
                        if (images.indexOf(img) === -1)
                            images.push(img);
                    });
                    banner = images.shift();
                    let pId = el.querySelector('.product-tile-link-wrapper').getAttribute('href');
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
            }
        );
        console.log(products);
        this.push(products);
    }
};
