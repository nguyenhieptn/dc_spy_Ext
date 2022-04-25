let Forallgift = class extends Initial {
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
                if (document.querySelector('.panel-forall-product-layout')) {
                    this.getProduct()
                } else if (document.querySelector('#search-results-counter')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("#content-inner-inner h1").innerText.trim();
        let images = [];
        document.querySelectorAll("#widget_pager_bottom_forall_product_images-default img").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace('product_thumb', '585x585')
            images.push(imgUrl);
        });
        let banner = images.shift();
        // if (!isURL(banner)) {
        //     expToast("error", "Cant get image!");
        //     return;
        // }
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
        document.querySelectorAll(".search-results > div").forEach((el) => {
                if (el.querySelector(".image img")) {
                    let banner = el.querySelector(".image img").getAttribute("data-src");
                    if (banner === undefined) {
                        banner = el.querySelector(".product-media img").getAttribute("src");
                    }
                    banner = banner.replace('product_list', '585x585')
                    let title = el.querySelector(".title a").textContent.trim();
                    let pId = el.querySelector(".image  > a").getAttribute('href');
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
