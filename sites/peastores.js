let Peastores = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('#shopify-section-product-template')) {
                this.getProduct();
            } else if (document.querySelector('#product_items_filter')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('div.product-template__container');
        let title = container.querySelector('.product-single__meta h2').innerText.trim();
        let banner;
        let images = [];
        document.querySelectorAll('#p-sliderproduct li img').forEach(function (el, k){
           let  imageUrl = el.getAttribute('data-src');
           imageUrl = imageUrl.replace('222x222', '900x900');
           images.push(imageUrl);
        });
        console.log(images);
        banner = images.shift();
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#product_items_filter .border-gray > a").forEach((el) => {
                if (el.querySelector('img')) {
                    let title = el.getAttribute('title');
                    let banner = el.querySelector('img').getAttribute("data-src");
                    banner = banner.replace('600x600', '900x900')
                    let pId =  el.getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        tags: tags,
                        store: location.host,
                        market: location.host
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
