let Wish = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('#react-app div[class^=ProductPage]')) {
                    this.getProduct();
                }
                else
                {
                    expToast("error", "cant crawl this page!");
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1[class^=PurchaseContainer__Name]").innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll("div[class^=ProductImageContainer__StripImagesWrapper] div[class^=ProductImageContainer__StripImages] div[class^=ProductImageContainer__StripImageWrapper]").forEach(function (el) {
            let image = el.querySelector('img').getAttribute('src');
            if (isURL(image) && image != null) {
                image = new URL(image);
                image = image.origin + image.pathname;
                if(image.indexOf('-tiny'))
                {
                    image = image.replace('-tiny', "-larger");
                }
                if(image.indexOf('-small'))
                {
                    image = image.replace('-small', "-larger");
                }
                images.push(image);
            }
        })
        banner = images.shift();
        let pId = null;
        pId = window.location.pathname;
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
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll('div.main-products > div:not(.ias-noneleft)').forEach((el) => {
                let title = el.querySelector("h4.name a").innerText;
                let banner = el.querySelector(".product-thumb div.image a img").getAttribute("src");
                console.log(banner);
                if (isURL(banner) && banner != null) {
                    if (banner.indexOf('/cache')) {
                        banner = banner.replace('/cache', '');
                    }
                    if (banner.indexOf('-228x228')) {
                        banner = banner.replace('-228x228', '');
                    }
                    let pId = el.querySelector("h4.name a").getAttribute("href");
                    pId = new URL(location.origin + pId);
                    pId = pId.pathname;
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
