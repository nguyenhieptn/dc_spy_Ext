let ShirtWoot = class extends Initial{
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
                if (document.querySelector("#content.wootplus")) {
                    this.getProduct()
                } else if (document.querySelector("#content section.offer-list")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("#product-info article#description div#attribute-selector header h1").innerText;
        let banner = document.querySelector("section#more-info #gallery div.fullsize-0 img").getAttribute('src');
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        let tags = [];

        let images = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "shirtWoot"
        };
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#content section.offer-list ul li").forEach((el) => {
                let title = el.querySelector(".info h2").innerText;
                if (el.querySelector("a img") !== null) {
                    let banner = el.querySelector("a img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        banner = banner.substr(0, banner.lastIndexOf("._SX"));
                        banner = banner + ext;
                        let pId = el.querySelector("a").getAttribute("href");
                        pId = new URL(location.origin+pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "shirtWoot"
                        };
                        products.push(product);
                    }
                }
            }
        );
       this.push(products);
    }
};
