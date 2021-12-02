let GearBubble = class extends Initial{
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
                if (document.querySelector("#zoom-container")) {
                    this.getProduct()
                } else if (location.pathname.indexOf('category') || location.pathname.indexOf('search')) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h4.form-title").innerText;
        let banner = null;
        let images = [];
        if (document.querySelector(".product-thumbnails a"))
        {
            document.querySelectorAll(".product-thumbnails a").forEach((el) => {
                let _img = el.getAttribute('data-product-image');
                console.log(_img);
                images.push(_img);
            })
        }
        else
        {
            images.push(document.querySelector('#product-image img').getAttribute('src'));
        }
        banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
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
            market: "gearbubble"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("ul.add-product-list > li").forEach((el) => {
                let title = el.querySelector("h4.field-title a").innerText;
                if (el.querySelector("div.image-block a") !== null) {
                    let banner = null;
                    if (el.querySelector("div.image-block a .card .front"))
                        banner = el.querySelector("div.image-block a .card .front img").getAttribute("src");
                    else
                        banner = el.querySelector("div.image-block a .card img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let images = [];
                        if (el.querySelector("div.image-block a .card .back img")) {
                            images.push(el.querySelector("div.image-block a .card .back img").getAttribute('src'));
                        }
                        let pId = el.querySelector("div.image-block a").getAttribute("href");
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            images: images,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "gearbubble"
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
