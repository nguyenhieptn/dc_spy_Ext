let Senprints = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        console.log(document.querySelector('.exp-template'))
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('#campaignPage')) {
                    this.getProduct()
                } else if (document.querySelector('div.campain-list')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("#campaignPage .title-campaign").innerText.trim();
        let images = [];
        document.querySelectorAll("#campaignPage .list-images img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace('160x200', '2000x2000')
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
        document.querySelectorAll(".campain-list .campaign-item").forEach((el) => {
                if (el.querySelector(".product-img")) {
                    let banner = el.querySelector(".product-img").getAttribute("src");
                    if (banner === undefined) {
                        banner = el.querySelector(".product-media img").getAttribute("data-src");
                    }
                    banner = banner.replace('600x750', '2000x2000')
                    let title = el.querySelector("h5").getAttribute('title').trim();
                    let pId = el.querySelector("h5 a").getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: location.origin + pId,
                        tags: tags,
                        store: location.host,
                        market: location.host
                    };
                    products.push(product);
                }
            }
        );
        this.push(products)
    }
};
