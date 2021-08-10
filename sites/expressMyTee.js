let ExpressMyTee = class extends Initial{
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
                if (document.querySelector("body#product")) {
                    this.getProduct()
                } else if (document.querySelector("body#category") || document.querySelector("body#search")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {

        let title = document.querySelector("section#main .tt-producttitle").innerText;
        let images = [];
        document.querySelectorAll('ul.product-images .owl-item').forEach((el) => {
            let src = el.querySelector('li img').getAttribute('data-image-large-src');
            images.push(src);
        })
        let banner = images.shift();
        images = [images.shift()];
        console.log(banner);
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = window.location.pathname;
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
            market: "expressmytee"
        };
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#js-product-list .products article").forEach((el) => {
                let title = el.querySelector("img.ttproduct-img1").getAttribute("alt");
                let banner = el.querySelector("img.ttproduct-img1").getAttribute("data-full-size-image-url");
                let images = [];
                if(el.querySelector("img.second_image"))
                {
                    images.push(el.querySelector("img.second_image").getAttribute("data-full-size-image-url"));
                }

                let pId = el.querySelector(".product-description .product-title a").getAttribute("href");
                pId = new URL(pId);
                pId = pId.pathname;
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    images: images,
                    tags: tags,
                    store: location.host,
                    market: "expressmytee"
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
