let ShopDisney = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('#pdpDetail')) {
                    this.getProduct()
                } else if (document.querySelector('div.search__layout')) {
                    this.getProducts()
                }
                else {
                    expToast("error", 'Cant crawl this page!');
                }
            });
        }
    }

    getProduct() {
        let productString = JSON.parse(document.querySelector('#pdpDetail').getAttribute('data-tealium-productstring'));
        let title = productString.name;
        let images = productString.image_url;
        let banner = images.shift();
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
        if (document.querySelector('div.search__items')) {
            document.querySelectorAll('div.search__items .products__grid div.product').forEach((el) => {
                    let productJson = JSON.parse(el.querySelector('.product__tile').getAttribute('data-tealium-productstring'));
                    let title = productJson.name;
                    let images = productJson.image_url;
                    let banner = images.shift();
                    if (isURL(banner) && banner != null) {
                        let pId = el.querySelector("a.product__tile_image_link").getAttribute("href");
                        pId = new URL(location.origin + pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            images: images,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: location.host
                        };
                        products.push(product);
                    }
                }
            );
        }
        console.log(products);
        this.push(products);
    }
};
