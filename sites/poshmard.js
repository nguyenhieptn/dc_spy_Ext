let Poshmard = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
            let button = document.querySelector('button.exp-btn-push')
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (location.pathname.indexOf('/listing/') === 0) {
                    this.getProduct()
                } else if (location.pathname.indexOf('/brand/') || location.pathname.indexOf('/search')) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title = document.querySelector("#content div.listing__title h1").innerText;
        let banner = null;
        let images = [];
        document.querySelectorAll('#content .listing__image div.carousel__inner ul li.carousel__item').forEach(function (el) {
            if (el.querySelector(' div img').getAttribute('src'))
                images.push(el.querySelector(' div img').getAttribute('src'));
            else
                images.push(el.querySelector(' div img').getAttribute('data-src'));
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
        if (document.querySelector('section.main__column')) {
            document.querySelectorAll('section.main__column div:last-child div.tile').forEach((el) => {
                    if (!el.querySelector("a:last-child > p") || !el.querySelector("a:last-child div span img")) {
                        return;
                    }
                    let title = el.querySelector("a:last-child > p").innerText;
                    let banner = el.querySelector("a:last-child div span img").getAttribute("src");
                    if (isURL(banner) && banner != null) {
                        if (banner.indexOf('_thumbnail')) {
                            banner = banner.replace('_thumbnail', '');
                        }
                        let pId = el.querySelector("a:last-child").getAttribute("href");
                        pId = new URL(location.origin + pId);
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
