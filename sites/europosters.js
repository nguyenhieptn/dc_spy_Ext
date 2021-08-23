let EuroPosters = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("div.portrait")) {
                    console.log('dvh');
                    this.getProduct()
                } else if (document.querySelector('.glass-catalog-page > .jscroll-inner > .product-shadow-hover')) {
                    this.getProducts()
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let container = document.querySelector('.portrait');
        let title = container.querySelector('h1').innerText;
        let banner = null;
        let _images = [];
        if (container.querySelector("#images-cover") !== null) {
            container.querySelectorAll("#images-cover span > picture > img").forEach((e) => {
                let imageUrl = e.getAttribute('src');
                if (isURL(imageUrl)) {
                    _images.push(imageUrl);
                }
            })
            container.querySelectorAll("#images-cover div.wall-merch > img").forEach((e) => {
                let imageUrl = e.getAttribute('src');
                if (isURL(imageUrl)) {
                    _images.push(imageUrl);
                }
            })

        }
        console.log(_images);
        let pId = null;
        pId = location.origin + location.pathname;
        if (!pId) return;
        let tags = [];
        let images = [];
        if (_images.length > 0) {
            images = _images;
            banner = images.shift();
        }
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
            market: "Europosters"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll('.glass-catalog-page > .jscroll-inner > .product-shadow-hover').forEach((el) => {
                let title = el.querySelector(".product-name a").innerText;
                if (el.querySelector("picture img")) {
                    let banner = el.querySelector("picture img").getAttribute('src');
                    banner = banner.replace('/350/', '/750/');
                    if (isURL(banner) && banner != null) {
                        let pId = el.querySelector("a.picture-cover").getAttribute("href");
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "Europosters"
                        };
                        products.push(product);
                    }
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
