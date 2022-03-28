let Helloyoucandles = class extends Initial{
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
                if (document.querySelector('div.productView')) {
                    this.getProduct()
                } else if (document.querySelector('.productGrid')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.productView-title").innerText.trim();
        let images = [];
        document.querySelectorAll(".slick-track li.productView-thumb img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace("/800x800", "/1280x1280");
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
        document.querySelectorAll("ul.productGrid li.product").forEach((el) => {
                if (el.querySelector(".card-image")) {
                    let banner = el.querySelector(".card-image").getAttribute("src");
                    banner = banner.replace("/500x500", '/1280x1280');
                    let title = el.querySelector(".card-title a").textContent;
                    let pId = el.querySelector(".card-title a").getAttribute('href');
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
