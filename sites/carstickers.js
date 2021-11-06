let Carstickers = class extends Initial {
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
            if (document.querySelector('h1.product-title')) {
                this.getProduct()
            } else if (document.querySelector('ul.gallery-grid li.search-result') || document.querySelector('#category-app')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('#clipart-product-app');
        if (container === null) {
            container = document.querySelector('#product-details');
        }
        let title = container.querySelector('h1.product-title').innerText;
        let banner;
        let images = [];
        container.querySelectorAll('div.alternate-image-container img').forEach(function (val, key) {
            let imgUrl = val.getAttribute('src').replace('thumbnail', 'preview');
            images.push(imgUrl);
        })
        banner = images.shift()
        console.log(banner);
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
            market: "carstickers"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        if (document.querySelector('ul.gallery-grid li.search-result'))
            document.querySelectorAll("ul.gallery-grid li.search-result").forEach((el) => {
                    if (el.querySelector("a.product-image") === null) return false;
                    let title = el.querySelector("a.product-image").getAttribute('title');
                    if (el.querySelector("a.search-img")) {
                        let banner = el.querySelector("a.search-img img").getAttribute("src");
                        banner = banner.replace('300x300', '550x550');
                        let pId = el.querySelector("a.product-image").getAttribute('href');
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "carstickers"
                        };
                        products.push(product);
                    }
                }
            );
        if(document.querySelector('ul.category-list li.category-list-item'))
        {
            document.querySelectorAll("ul.category-list li.category-list-item").forEach((el) => {
                    if (el.querySelector("a.image") === null) return false;
                    let title = el.querySelector("a.image img").getAttribute('alt');
                    if (el.querySelector("a.image")) {
                        let banner = el.querySelector("a.image img").getAttribute("src");
                        banner = banner.replace('300x300', '550x550');
                        let pId = el.querySelector("a.image").getAttribute('href');
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "carstickers"
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
