let NerdKungfu = class extends Initial{
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
                if (document.querySelector("div.productView")) {
                    this.getProduct()
                } else if (document.querySelector('#product-listing-container')) {
                    this.getProducts()
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector(".productView-title").innerText;
        let banner = null;
        let _images = [];
        if (document.querySelector("ul.productView-thumbnails li.productView-thumbnail") !== null) {
            document.querySelectorAll("ul.productView-thumbnails li.productView-thumbnail").forEach((e) => {
                let imageUrl = e.querySelector('a img').getAttribute('srcset');
                console.log(imageUrl);
                imageUrl = imageUrl.split(", ");
                imageUrl = imageUrl[imageUrl.length - 1];
                imageUrl = imageUrl.substring(0, imageUrl.indexOf(' '));
                console.log(imageUrl);
                if (isURL(imageUrl)) {
                    imageUrl = new URL(imageUrl);
                    imageUrl = imageUrl.origin + imageUrl.pathname;
                    _images.push(imageUrl);
                }
            })
        }
        console.log(_images);
        let pId = null;
        pId = location.origin+location.pathname;
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
            market: "NerdKungfu"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        if (document.querySelector('#product-listing-container ul.productGrid')) {
            document.querySelectorAll('#product-listing-container ul.productGrid li.product').forEach((el) => {
                    let title = el.querySelector("h4.card-title a").innerText;
                    if (el.querySelector(".card-img-container img")) {
                        let banner = el.querySelector('.card-img-container img').getAttribute('srcset')
                        banner = banner.split(", ");
                        banner = banner[banner.length - 1];
                        banner = banner.substring(0, banner.indexOf(' '));
                        banner = new URL(banner);
                        banner = banner.origin + banner.pathname;
                        if (isURL(banner) && banner != null) {
                            let pId = el.querySelector("figure.card-figure a").getAttribute("href");
                            let tags = [];
                            let product = {
                                type: "",
                                title: title,
                                banner: banner,
                                item_id: pId,
                                tags: tags,
                                store: location.host,
                                market: "NerdKungfu"
                            };
                            products.push(product);
                        }
                    }
                }
            );
        }
        console.log(products);
        this.push(products);
    }
};
