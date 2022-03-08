let Giftsie = class extends Initial{
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
                if (document.querySelector('div.product-listing')) {
                    this.getProduct()
                } else if (document.querySelector('.catalog-listing-products') || location.pathname.index) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector(".product-listing .product-title").innerText.trim();
        let images = [];
        document.querySelectorAll("#glideProductImages img.product-thumb").forEach(function (v, k) {
            let imgUrl = v.getAttribute('src');
            imgUrl = imgUrl.replace("/w625", "/w1500");
            imgUrl = imgUrl.replace("/h625", "/h1500");
            images.push(imgUrl);
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = document.querySelector('meta[itemprop="productID"]').getAttribute('content');
        pId = pId.substring(pId.indexOf("(")+1);
        pId = pId.replace(')', "");
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
            market: giftsie,
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".catalog-listing-products .products_over").forEach((el) => {
                if (el.querySelector(".product-thumb")) {
                    let banner = el.querySelector(".product-thumb").getAttribute("src");
                    banner = banner.replace("/w350", '/w1500');
                    banner = banner.replace("/h350", '/h1500');
                    let title = el.querySelector(".product-thumb").getAttribute("title");
                    let pId = el.getAttribute('data-pid');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: location.origin+el.querySelector('a').getAttribute('href'),
                        tags: tags,
                        store: location.host,
                        market: "giftsie"
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products)
    }
};
