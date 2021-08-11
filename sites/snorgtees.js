let Snorgtees = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        window.onload = function () {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                that.getProduct()
            })
        }
    }

    getProduct(callback) {
        let container = document.querySelector('div.product-view div.product-essential');
        let banner = container.querySelector('div.product-image .product-image-gallery img.visible').getAttribute('data-zoom-image');
        let title = container.querySelector('div.product-name span.h1').textContent;
        let product = {
            type: "",
            images: [],
            tags: [],
            item_id: location.pathname,
            title: title,
            banner: banner,
            store: location.host,
            market: location.host
        }
        this.pushProduct([product]);
    }

    pushProduct(products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            this.push(products);
        }
    }

}
