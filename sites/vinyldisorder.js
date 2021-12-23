let Vinyldisorder = class extends Initial{
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
                if (document.querySelector('form .item-area')) {
                    this.getProduct()
                } else if (document.querySelector('#conts')) {
                    this.getProducts();
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector("h1.itemheader").innerText;
        let images = [];
        let banner = document.querySelector('.zoomWindowContainer > div').style.backgroundImage.slice(4, -1).replace(/"/g, "");
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = location.pathname;
        let source_url= location.origin+pId;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            source_url: source_url,
            tags: tags,
            images: images,
            store: location.host,
            market: "vinyldisorder"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("#conts > div").forEach((el) => {
                if (el.querySelector(".contstop img")) {
                    let banner = el.querySelector(".contstop img").getAttribute("data-src");
                    if(!banner) {
                        banner = el.querySelector(".contstop img").getAttribute("src");
                    }
                    if(!banner) return false;
                    let title = el.querySelector("div.name a").getAttribute('title');
                    let pId = el.querySelector('.contstop a').getAttribute('href');
                    let source_url= location.origin+'/'+pId;
                    let tags = [];
                    let product = {
                        type: "",
                        title: title,
                        banner: banner,
                        item_id: pId,
                        source_url: source_url,
                        tags: tags,
                        store: location.host,
                        market: "vinyldisorder"
                    };
                    products.push(product);
                }
            }
        );
        console.log(products);
        this.push(products)
    }
};
