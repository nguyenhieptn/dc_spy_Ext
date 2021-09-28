let Myspreadshop = class extends Initial{
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
                if (document.querySelector("main.sprd-detail-page")) {
                    this.getProduct()
                } else if (document.querySelector('main.sprd-product-list')) {
                    this.getProducts()
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector('.sprd-detail-info h1').innerText.trim();
        let banner = null;
        let _images = [];
        if (document.querySelector("div.sprd-detail-images__views") !== null) {
            document.querySelectorAll("div.sprd-detail-images__views img").forEach((e) => {
                let imageUrl = e.getAttribute('src');
                console.log(imageUrl);
                imageUrl = imageUrl.replace("width=650,height=650", "width=1000,height=1000");
                _images.push(imageUrl);
            })
        }
        console.log(_images);
        let pId = null;
        pId = location.origin+location.pathname;
        if (!pId) return;
        let tags = [];
        let images = [];
        if (_images.length > 0) {
            images = _images;
            banner = images.shift();
        }
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
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
        document.querySelectorAll('main.sprd-product-list .sprd-product-list-item').forEach((el) => {
                if (el.querySelector(".sprd-img-spinner__image").getAttribute('alt')) {
                	if(el.querySelector('.sprd-img-spinner__image') === null) 
                    {
                    	 console.log(el.querySelector('.sprd-img-spinner__image'));
                    	expToast("error", 'Cant get Images! Scroll down!');
                    }
                    let banner = el.querySelector('.sprd-img-spinner__image').getAttribute('src')
                    let title = el.querySelector(".sprd-img-spinner__image").getAttribute('alt');
                   	banner = banner.replace("width=650,height=650", "width=1000,height=1000");
                    if (isURL(banner) && banner != null) {
                        let pId = el.querySelector("a.sprd-product-list-item__link").getAttribute("href");
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
