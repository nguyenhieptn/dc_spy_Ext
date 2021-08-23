let Woo = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') !== null) {
            let button = document.querySelector('button.exp-btn-push');
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector("body.single .product")) {
                    this.getProduct()
                } else if (location.pathname.indexOf('products') !== -1 ||
                    location.pathname.indexOf('collection') !== -1 ||
                    location.pathname.indexOf('product-tag') !== -1 ||
                    document.querySelector('body.archive')
                ) {
                    this.getProducts()
                }
                else
                    expToast("error",'Cant crawl this page!');
            });
        }
    }

    getProduct() {
        let title = document.querySelector(".single-product .product-title").innerText;
        let banner = null;
        let _images = [];
        if (document.querySelector("img[data-large_image]") === null) {
            if (location.origin === "https://wozoro.com") {
                banner = document.querySelector(".single-product-main-image img").getAttribute("src");
                if (document.querySelectorAll(".slick-slider .slick-list .slick-slide:not(.slick-active)")) {
                    document.querySelectorAll(".slick-slider .slick-list .slick-slide:not(.slick-active)").forEach((e) => {
                        let imageUrl = new URL(e.querySelector('img').getAttribute('src'));
                        imageUrl = imageUrl.origin + imageUrl.pathname;
                        _images.push(imageUrl);
                    })
                }
            }
        } else {
            banner = document.querySelector("img[data-large_image]").getAttribute("data-large_image");
        }
        if (!banner) {
            banner = document.querySelector(".slick-slider .slick-current img").getAttribute("data-large-file")
        }
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let pId = null;
        pId = window.location.href;
        if (!pId) return;
        let elm = document.querySelector("[data-content_category]");
        let tags = [];
        if (elm) {
            tags = JSON.parse(elm.getAttribute("data-content_category"));
        }
        if (tags.length === 0) {
            if (document.querySelector('span.tagged_as') !== null) {
                document.querySelectorAll('span.tagged_as a').forEach((e) => {
                    tags.push(e.textContent);
                });
            }
        }

        let images = [];
        if (_images.length > 0) {
            images = _images;
        } else {
            document.querySelectorAll(".product-thumbnails .attachment-woocommerce_thumbnail").forEach(function (el) {
                images.push(el.getAttribute("src"));
            })
        }
        if (images.length === 0) {
            document.querySelectorAll(".slick-slider div.slick-active:not(.slick-current)").forEach(function (el) {
                images.push(el.querySelector('img').getAttribute('data-large-file'));
            })
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
        this.push([product])
    }

    getProducts() {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        console.log(campaign_id);
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let products = [];
        if (location.pathname.indexOf("/search-results/") === 0 && document.querySelector('ul.snize-search-results-content')) {
            console.log('dvh');
            document.querySelectorAll("ul.snize-search-results-content li.snize-product").forEach((el) => {
                    let title = el.querySelector("span.snize-title").innerText;
                    if (el.querySelector("img.snize-item-image")) {
                        let banner = el.querySelector("img.snize-item-image").getAttribute("src");
                        if (isURL(banner) && banner != null) {
                            let pId = el.querySelector("a.snize-view-link").getAttribute("href");
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
                }
            );
        } else
        {
            document.querySelectorAll("body.archive .products .product").forEach((el) => {
                    let title = el.querySelector(".product-title a").innerText;
                    if (el.querySelector("img.attachment-woocommerce_thumbnail") !== null || el.querySelector(".box-image a img")) {
                        let banner;
                        if(el.querySelector("img.attachment-woocommerce_thumbnail"))
                        {
                            banner = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute("src");
                        }
                        else {
                            banner = el.querySelector(".box-image a img").getAttribute("src");
                        }
                        if (isURL(banner) && banner != null) {
                            banner = new URL(banner);
                            banner = banner.origin + banner.pathname;
                            let pId = el.querySelector(".product-title a").getAttribute("href");
                            pId = new URL(pId);
                            pId = pId.pathname;
                            let elm = el.querySelector("[data-content_category]");
                            let tags = [];
                            if (elm) {
                                tags = JSON.parse(elm.getAttribute("data-content_category"));
                            }
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
                    else if(el.querySelector(".box-image .image-none img"))
                    {
                        let banner = el.querySelector(".box-image .image-none img").getAttribute("src");
                        if (isURL(banner) && banner != null) {
                            let pId = new URL(el.querySelector(".product-title a").getAttribute("href"));
                            pId = pId.pathname;
                            let elm = el.querySelector("[data-content_category]");
                            let tags = [];
                            if (elm) {
                                tags = JSON.parse(elm.getAttribute("data-content_category"));
                            }
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
                }
            );
        }
        console.log(products);
        this.push(products);
    }
};
