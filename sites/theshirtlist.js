let TheShirtList = class extends Initial{
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
                if (document.querySelector("body.single")) {
                    console.log('dvh');
                    this.getProduct()
                } else if (document.querySelector('div.elementor-location-archive')) {
                    this.getProducts()
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.uael-heading a span").innerText;
        let images = [];
        document.querySelectorAll(".elementor-widget-theme-post-content img.size-full").forEach(function (v, k){
            images.push(v.getAttribute('src'));
        });
        let banner = images.shift();
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let elm = document.querySelector("ul.elementor-post-info");
        let tags = [];
        if (elm) {
            let tagcontainer = null;
            document.querySelectorAll('ul.elementor-post-info li').forEach(function (v, k) {
                if(v.querySelector('span.elementor-post-info__item-prefix').textContent === "Tags")
                {
                    tagcontainer = v;
                }
            })
            if(tagcontainer)
            {
                console.log(tagcontainer);
                tagcontainer = tagcontainer.querySelector('span.elementor-post-info__terms-list')
                if(tagcontainer)
                {
                    tagcontainer.querySelectorAll('a').forEach(function (v, k) {
                        tags.push(v.textContent);
                    })
                }
            }
        }
        console.log(images, banner);
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "woo"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("div.elementor-widget-container .elementor-posts article").forEach((el) => {
                let title = el.querySelector(".elementor-post__title").innerText;
                if (el.querySelector(".elementor-post__thumbnail img")) {
                    let banner = el.querySelector(".elementor-post__thumbnail img").getAttribute("src");
                    banner = banner.replace('-300x300', "");
                    let pId = new URL(el.querySelector("a.elementor-post__thumbnail__link").getAttribute("href"));
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
        console.log(products);
        this.push(products);
    }
};
