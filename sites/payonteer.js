let PayOnTeer = class extends Initial{
    constructor() {
        super()
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("#campaign")) {
                    this.getProduct()
                } else if (document.querySelector(".store-collection")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("#campaign h1.campaign-title").innerText;
        let images = [];
        let banner = document.querySelector("#campaign .campaign-preview .img-container img").getAttribute('src');
        banner = new URL(banner);
        banner = banner.origin + banner.pathname;
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
            market: "payonteer"
        };
        console.log(product);
        this.push(product);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#hits-container .ais-hits--item").forEach((el) => {
                let title = el.querySelector("h3.label-campaign-name").textContent;
                let banner = el.querySelector("div.label-campaign-image-first img").getAttribute("data-src");
                banner = new URL(banner);
                banner = banner.origin + banner.pathname;
                let images = [];
                let pId = location.origin + el.querySelector("a.campaign-link").getAttribute("href");
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
                    market: "payonteer"
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
