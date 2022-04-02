let Giftsforyounow = class extends Initial{
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
                if (document.querySelector('#product-page')) {
                    this.getProduct()
                } else if (document.querySelector('#productgrid')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.tag").innerText.trim();
        let images = [];
        // document.querySelectorAll("div.thumbs img").forEach(function (v, k) {
        //     let imgUrl = v.getAttribute('src');
        //     imgUrl = imgUrl.replace("/230x230x2", "/1024x1024x2");
        //     images.push(imgUrl);
        // });
        let banner = location.origin+document.querySelector(".sp-large img").getAttribute('src');
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.pathname;
        pId = pId.substring(pId.indexOf("(")+1);
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
        document.querySelectorAll("#productgrid .record").forEach((el) => {
                if (el.querySelector(".recordimage img")) {
                    let banner = el.querySelector(".recordimage img").getAttribute("src");
                    banner = banner.replace("1-M", '1-L');
                    let title = el.querySelector(".recordname").textContent.trim();
                    let pId = el.querySelector("a").getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: location.origin+pId,
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
