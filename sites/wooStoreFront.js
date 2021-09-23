let WooStoreFront = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        console.log('wooStoreFront.js');
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("body.single-product")) {
                    this.getProduct()
                } else if (document.querySelector("body.archive .products")) {
                    this.getProducts()
                }
            });
        }
    }

    getProduct() {
        let title;
        if (document.querySelector("body.single-product .product_title")) {
            title = document.querySelector("body.single-product .product_title").innerText;
        } else if (document.querySelector("h3.eltdf-single-product-title")) {
            title = document.querySelector("h3.eltdf-single-product-title").innerText;
        }
        let banner = null;
        let images = [];
        document.querySelectorAll("body.single-product .images ol.flex-control-thumbs li").forEach((el) => {
            let _img = el.querySelector('img').getAttribute('src');
            if (_img.indexOf('-100x100')) {
                _img = _img.replace('-100x100', '');
            }
            if (images.indexOf(_img) === -1)
                images.push(_img);
        })
        banner = images.shift();
        if (!banner) {
            banner = document.querySelector(".slick-slider .slick-current img");
            if (banner && banner.hasAttribute('data-large_image') && banner.getAttribute('data-large_image') !== "") {
                banner = banner.getAttribute('data-large_image');
            } else if (banner && banner.hasAttribute('data-large-file') && banner.getAttribute('data-large-file') !== "") {
                banner = banner.getAttribute("data-large-file")
            } else if (banner) {
                banner = banner.getAttribute('src');
            }
        }

        if (!banner && document.querySelector('.woocommerce-product-gallery__image')) {
            let bannerDiv = document.querySelector('.woocommerce-product-gallery__image');
            if (document.querySelector('.woocommerce-product-gallery__image > img.zoomImg')) {
                banner = document.querySelector('.woocommerce-product-gallery__image > img.zoomImg').getAttribute('src');
            } else if (document.querySelector('.woocommerce-product-gallery__image > img.wp-post-image')) {
                banner = document.querySelector('.woocommerce-product-gallery__image > img.wp-post-image').getAttribute('data-large_image');
            }
        }

        if (!banner && document.querySelector('.woocommerce-product-gallery__image')) {
            document.querySelectorAll(".woocommerce-product-gallery__wrapper img:not(.wp-post-image)").forEach(function (el) {
                images.push(el.getAttribute('data-large_image'));
            })
            banner = images.shift();
        }
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.pathname;
        if (!pId) return;
        let tags = [];
        if (document.querySelector('span.tagged_as')) {
            document.querySelectorAll('span.tagged_as a').forEach(function (e) {
                tags.push(e.textContent);
            })
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: "Woo"
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        document.querySelectorAll("body.archive .products .product, body.archive ul.products li").forEach((el) => {
                let title;
                if (el.querySelector("h2.woocommerce-loop-product__title")) {
                    title = el.querySelector("h2.woocommerce-loop-product__title").innerText;
                } else {
                    title = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute("alt").innerText;
                }
                if (el.querySelector(".attachment-woocommerce_thumbnail") !== null) {
                    let banner = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute("src");
                    if (banner.indexOf('-356-442')) {
                        banner = banner.replace('-356-442', '');
                    }
                    console.log(banner);
                    if (isURL(banner) && banner != null) {
                        let ext = banner.substr(banner.lastIndexOf("."));
                        if (location.host !== "moodthology.com")
                        {
                            banner = new URL(banner);
                            banner = banner.origin+banner.pathname;
                        }
                        else
                        {
                            banner = banner.replace("-616x616", "");
                        }
                        let pId;
                        if(el.querySelector("a.woocommerce-loop-product__link"))
                        {
                            pId = el.querySelector("a.woocommerce-loop-product__link").getAttribute("href");
                        }
                        else if(el.querySelector("a.product-image")) {
                          pId = el.querySelector("a.product-image").getAttribute("href");
                        }
                        pId = new URL(pId);
                        pId = pId.pathname;
                        let tags = [];
                        let product = {
                            type: "",
                            title: title,
                            banner: banner,
                            item_id: pId,
                            tags: tags,
                            store: location.host,
                            market: "Woo"
                        };
                        products.push(product);
                    }
                }
            }
        );
        console.log(products);
        this.push(products);
    }
};
