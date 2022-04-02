let TeenPublic = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('section.m-search__designs')) {
                console.log("product");
                that.getProducts()
            } else if (document.querySelector('.m-design__content')) {
                that.getProduct();
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".jsDesignContainer").forEach((el) => {
            let elm = el.querySelector(".m-tiles__design a img");
            let banner = elm.getAttribute("data-src");
            let title = elm.getAttribute("alt");
            if(title === "")
            {
                title = el.querySelector('div.m-tiles__infos .m-tiles__title a').textContent;
            }
            let pId = el.querySelector('.m-tiles__preview').getAttribute("href");
            let tags = [];
            let tagsStr = el.querySelector('.m-tiles__tag-secondary').textContent;
            tagsStr = tagsStr.substr(7);
            tags = tagsStr.split(', ');
            let type = "";
            let product = {
                type: type,
                title: title,
                banner: banner,
                item_id: pId,
                tags: tags,
                store: "teenpublic",
                market: "teenpublic"
            };
            products.push(product);
        });

        this.push(products);
    }

    getProduct() {
        let title;
        if (document.querySelector("#exp-custom-title") && document.querySelector("#exp-custom-title").value !== "") {
            title = document.querySelector("#exp-custom-title").value;
        } else {
            title = document.querySelector(".m-design__content .m-design__title h1").innerText;
        }
        let store = "teepublic";
        let pId = location.href.substr(25);
        let images = [];
        if (document.querySelector(".m-product-preview__thumbs"))
            if (document.querySelector(".m-product-preview__thumbs").querySelectorAll('div.jsProductPreviewThumb img').length > 0)
                document.querySelector(".m-product-preview__thumbs").querySelectorAll('div.jsProductPreviewThumb img').forEach(function (el) {
                    images.push(el.getAttribute("src"));
                });
            else if(document.querySelector(".m-product-preview__thumbs").querySelectorAll('.jsProductPreviewThumb img').length > 0)
            {
                document.querySelector(".m-product-preview__thumbs").querySelectorAll('.jsProductPreviewThumb img').forEach(function (el) {
                    images.push(el.getAttribute("src"));
                });
            }

            else return;
        let banner;
        if (document.querySelector('#exp-banner-type') && document.querySelector('#exp-banner-type').value === 'art') {
            banner = images.pop();
        } else
            banner = images.shift();
        let type = "";
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "teepublic"
        };
        console.log(product);
        this.push([product])
    }
};
