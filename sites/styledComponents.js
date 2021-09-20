let StyledComponents = class extends Initial {
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
            if (document.querySelector('.listing')) {
                this.getProduct();
            } else if (document.querySelector('div.product-tile-grid')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('.listing-content');
        let title = container.querySelector('.listing-header__title').innerText.trim();
        let banner = null;
        let images = [];
        document.querySelectorAll('.listing-gallery-menu > button').forEach((item, i) => {
          let img = item.querySelector('img').getAttribute('src');
          img = img.replaceAll('60', '1000');
          images.push(img);
        });
        banner = images.shift();
        let pId = null;
        pId = location.pathname+location.search;
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
            market: 'StyledComponents'
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        let containerProducts = [];
        if (document.querySelectorAll('.product-tile-grid'))
            containerProducts = document.querySelectorAll('.product-tile-grid > .product-tile')
        containerProducts.forEach((el) => {
                let title = el.querySelector('.product-tile-title').textContent.trim();
                let banner = el.querySelector('div.product-tile-image-default');
                banner = banner.currentStyle || window.getComputedStyle(banner, false)
                banner = banner.backgroundImage.slice(4, -1).replace(/"/g, "").replaceAll('560', '1000');
                let images = [];
                let pId = el.querySelector('a.product-tile-link-wrapper').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    tags: tags,
                    store: location.host,
                    market: 'StyledComponents'
                };
                products.push(product);
            }
        );
        console.log(products);
        this.push(products);
    }
};
