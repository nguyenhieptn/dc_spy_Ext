let Chyroll = class extends Initial {
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
            if (document.querySelector('div.product-detail')) {
                this.getProduct();
            } else if (document.querySelector('div.search') || document.querySelector('.shoplaza-section')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('div.product-detail');
        let title = container.querySelector('h1.product-info__header_title').innerText.trim();
        let banner = document.querySelector('.product-image img.product-image__swiper_img').getAttribute('data-zoom-src');
        banner = "https:"+banner;
        let images = [];
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
        let containerProducts;
        if(document.querySelector('.search'))
        {
            containerProducts = document.querySelectorAll('.search .common__product-gap')
        }
        else if(document.querySelector('.collection__container'))
        {
            containerProducts = document.querySelectorAll(".collection__container .common__product-gap")
        }
        containerProducts.forEach((el) => {
                if (el.querySelector('img')) {
                    let title = el.querySelector('.product-snippet__title-normal ').textContent;
                    let banner = el.querySelector('img').getAttribute("data-srcset");
                    if(banner !== null){
                        banner = banner.split(", ");
                        banner = banner[banner.length-1];
                        banner = banner.substring(0, banner.indexOf(' '));
                        banner = "https:"+banner.replace('360x', '1080x');
                        banner = banner.replace('360', '1080x');
                        console.log(banner);
                        let pId =  el.querySelector('a.product-snippet__img-wrapper').getAttribute('href');
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
            }
        );
        console.log(products);
        this.push(products);
    }
};
