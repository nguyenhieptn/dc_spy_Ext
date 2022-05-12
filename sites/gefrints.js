let Gefrints = class extends Initial {
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
                if (document.querySelector('[class^="styled__MockupsArea"]')) {
                    this.getProduct()
                } else if (document.querySelector('a[data-qa="StyledStoreProduct"]')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector('h1[data-qa="product-name"]').innerText.trim();
        let images = [];
        document.querySelectorAll('span[class^="styled__MockupImageBox"]').forEach(function (v, k) {
            let imgUrl = v.querySelector('img').getAttribute('src');
            images.push(imgUrl);
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.href;
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
            market: location.host,
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll('a[data-qa="StyledStoreProduct"]').forEach((el) => {
                if (el.querySelector("img")) {
                    let banner = el.querySelector("img").getAttribute("src");
                    if (banner === undefined) {
                        banner = el.querySelector("img").getAttribute("data-src");
                    }
                    let title = el.querySelector('h5[data-qa="Title"]').textContent.trim().replace('GE - ', "");
                    let pId = location.origin+el.getAttribute('href');
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: pId,
                        tags: tags,
                        store: location.host,
                        market: location.host
                    };
                    products.push(product);
                }
            }
        );
        console.log(products)
        this.push(products)
    }
};
