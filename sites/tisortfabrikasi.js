let Tisortfabrikasi = class extends Initial{
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
                if (document.querySelector('#ProductDetailMain')) {
                    this.getProduct()
                } else if (document.querySelector('#ProductPageProductList')) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector('#ProductDetailMain div.ProductName h1 span').innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll('#ProductDetailMain #divThumbList div').forEach(function (el) {
            let _img = el.querySelector('img').getAttribute('src');
            _img = _img.replace('thumb', 'buyuk');
            let img = new URL(location.origin+_img);
            images.push(img.href);
        })
        banner = images.shift();
        let pId = null;
        pId = window.location.pathname;
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
            market: location.host
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        if (document.querySelector('#ProductPageProductList')) {
            document.querySelectorAll('#ProductPageProductList div.productItem').forEach((el) => {
                    let title = el.querySelector('.productImage a img').getAttribute('alt');
                    let banner = el.querySelector('.productImage a img').getAttribute('src');
                    banner = banner.replace('thumb', 'buyuk');
                    banner = location.origin+banner;
                    if (isURL(banner) && banner != null) {
                        let pId = new URL(location.origin+el.querySelector('.productImage a').getAttribute('href'));
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            images: [],
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: location.host
                        };
                        products.push(product);
                    }
                }
            );
        }
        console.log(products);
        this.push(products);
    }
};
