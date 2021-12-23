let Minted = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build()
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector(".product-option-panel")) {
                this.getProduct()
            } else if (document.getElementsByClassName('.list-view-items')) {
                this.getProductsCategory()
            } else if (document.getElementsByClassName('#searchResults')) {
                this.getProductsSearch()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let title = document.querySelector(".product-info__product-title").innerText.trim();
        let images = [];
        let banner = document.querySelector('.hero-image__image-container img').getAttribute('fallback');
        document.querySelectorAll('.hero-image__carousel-container img').forEach(function (image) {
            let imgUrl = new URL(image.getAttribute('src'));
            imgUrl = imgUrl.origin + imgUrl.pathname;
            if (imgUrl.indexOf('-006') !== -1)
                imgUrl = imgUrl.replace(imgUrl.substring(imgUrl.indexOf('-006'), imgUrl.length), "-006_A_PZ.jpg");
            if (imgUrl.indexOf('-001') !== -1)
                imgUrl = imgUrl.replace(imgUrl.substring(imgUrl.indexOf('-001'), imgUrl.length), "-006_A_PZ.jpg");
            console.log(imgUrl);
            images.push(imgUrl);
        });
        images.shift();
        let pId = location.pathname;
        if (!pId) return;
        let tags = [];
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            source_url: location.origin + pId,
            images: images,
            store: location.host,
            market: location.host,
        };
        console.log(product);
        this.push([product])
    }

    getProductsCategory() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelectorAll('.cat-grid-container > div.css-0 > div')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('img').getAttribute('alt');
                let banner = new URL(el.querySelector('img').getAttribute('src'));
                banner = banner.origin + banner.pathname;
                if(banner.indexOf("-007") !== -1)
                {
                    banner = banner.replace(banner.substring(banner.indexOf('-017'), banner.length), "-006_A_PZ.jpg");
                }
                if(banner.indexOf("-011") !== -1)
                {
                    banner = banner.replace(banner.substring(banner.indexOf('-011'), banner.length), "-006_A_PZ.jpg");
                }
                console.log(banner);
                let pId = el.querySelector('a:first-child').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    source_url: location.origin + pId,
                    tags: tags,
                    store: location.host,
                    market: location.host,
                };
                products.push(product);
            }
        });
        console.log(products);
        this.push(products);
    }
    getProductsSearch() {
        let products = [];
        let containerProducts;
        containerProducts = document.querySelectorAll('.cat-grid-container > div')
        containerProducts.forEach((el) => {
            if (el.querySelector('img')) {
                let title = el.querySelector('img').getAttribute('alt');
                let banner = new URL(el.querySelector('img').getAttribute('src'));
                banner = banner.origin + banner.pathname;
                banner = banner.replace(banner.substring(banner.indexOf('-011'), banner.length), "-006_A_PZ.jpg");
                console.log(banner);
                let pId = el.querySelector('a').getAttribute('href');
                let tags = [];
                let product = {
                    type: "",
                    title: title,
                    banner: banner,
                    item_id: pId,
                    source_url: location.origin + pId,
                    tags: tags,
                    store: location.host,
                    market: location.host,
                };
                products.push(product);
            }
        });
        console.log(products);
        this.push(products);
    }
};
