let Carousell = class extends Initial {
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
                if (location.pathname.indexOf('/p/') === 0) {
                    this.getProduct();
                } else if (location.pathname.indexOf('/categories/') || location.pathname.indexOf('collection')) {
                    this.getProducts();
                }
            });
        }

    getProduct() {
        let title = document.querySelector("#root h1").innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll('#root button span img[title=""]').forEach(function (el) {
            images.push(el.getAttribute('src'))
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
        if (document.querySelector('main')) {
            document.querySelectorAll('main > div > div > div > div:not([id])').forEach((el) => {
                    if(!el.querySelector("a:last-child > p") || !el.querySelector("a:last-child div span img"))
                    {
                        return;
                    }
                    let title = el.querySelector("a:last-child > p").innerText;
                    let banner = el.querySelector("a:last-child div span img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        if(banner.indexOf('_thumbnail'))
                        {
                            banner = banner.replace('_thumbnail', '');
                        }
                        let pId = el.querySelector("a:last-child").getAttribute("href");
                        pId = new URL(location.origin+pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "woo"
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
