let Moosfy = class extends Initial{
    constructor(){
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
                if (document.querySelector("body.page-type-product")) {
                    this.getProduct()
                }else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let container = document.querySelector('.productView');
        let title = container.querySelector('h1.productView-title').innerText;
        let banner = container.querySelector('section.productView-images meta').getAttribute('content');
        banner = new URL(banner);
        banner = banner.origin+banner.pathname;
        let pId = null;
        pId = location.origin + location.pathname;
        if (!pId) return;
        let tags = [];
        let images = [];
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
            market: "Moosfy"
        };
        console.log(product);
        this.push([product]);
    }
};
