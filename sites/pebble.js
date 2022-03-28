let Pebble = class extends Initial{
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
                if (document.querySelector('div.product-wrap')) {
                    this.getProduct()
                } else if (document.querySelector('.product-list')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.product-page").innerText.trim();
        let images = [];
        document.querySelectorAll("div.thumbs img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace("/230x230x2", "/1024x1024x2");
            images.push(imgUrl);
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.origin + location.pathname;
        pId = pId.substring(pId.indexOf("(")+1);
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            source_url: location.href,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host,
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".product-list .product").forEach((el) => {
                if (el.querySelector(".image-wrap img")) {
                    let banner = el.querySelector(".image-wrap img").getAttribute("src");
                    banner = banner.replace("/800x800x2", '/1024x1024x2');
                    let title = el.querySelector(".title-wrap a").textContent.trim();
                    let pId = el.querySelector(".title-wrap a").getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: pId,
                        tags: tags,
                        store: location.host,
                        market: location.host
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products)
    }
};
