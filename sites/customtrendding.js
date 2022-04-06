let Customtrendding = class extends Initial{
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
                if (document.querySelector('main.single-product')) {
                    this.getProduct()
                }
                else if (document.querySelector('.product-wrapper')) {
                        this.getProducts();
                }
                else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector(".single-product h1.product-name").innerText.trim();
        let images = [];
        document.querySelectorAll(".single-product figure.p-slider img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            if(imgUrl === undefined)
            {
                imgUrl = v.getAttribute('data-src');
            }
            images.push(imgUrl);
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            source_url: location.origin + location.pathname,
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
        document.querySelectorAll(".product-wrapper .product-wrap").forEach((el) => {
                if (el.querySelector(".product-media img")) {
                    let banner = el.querySelector(".product-media img").getAttribute("src");
                    if(banner === undefined)
                    {
                        banner = el.querySelector(".product-media img").getAttribute("data-src");
                    }
                    let title = el.querySelector(".product-name a").textContent.trim();
                    let pId = el.querySelector(".product-name a").getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: location.origin+pId,
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
