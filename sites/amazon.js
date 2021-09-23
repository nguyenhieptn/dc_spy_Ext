let Amazon = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let that = this;
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (location.href.indexOf("https://www.amazon.com/") !== -1 && location.href.indexOf("/dp/") !== -1) {
                that.getProduct()
            } else if (location.href.indexOf("https://www.amazon.com/s") !== -1) {
                that.getProducts();
            }
        });
    }

    getProducts() {
        let keyword = document.querySelector("input[name=\"field-keywords\"]").value;
        let products = [];
        document.querySelectorAll("[data-component-type=\"s-search-results\"] > .s-search-results [data-asin]").forEach((el) => {
            let elm = el.querySelector("img[class*=\"image\"]");
            if(elm == null) return;
            let banner = elm.getAttribute("src");
            if (!isURL(banner)) return;
            banner = banner.substring(0, banner.lastIndexOf("."));
            banner = banner.substring(0, banner.lastIndexOf("."));
            banner += "._SL1500_.jpg";
            let title = elm.getAttribute("alt");
            let pId = el.getAttribute("data-asin");
            let tags = [];
            tags.push(keyword);
            let store = "";
            let product = {
                title: title,
                banner: banner,
                item_id: pId,
                tags: tags,
                store: store,
                market: "amazon"
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }

    getProduct() {
        let title = document.querySelector("#productTitle").innerText.trim();
        let elm = document.querySelector("#bylineInfo");
        let store = (elm) ? elm.innerText : "";
        let pId;
        if (document.querySelector('#averageCustomerReviews') != null) {
            if (document.getElementById('variation_color_name ul') != null) {
                let colorSelected = document.getElementById('variation_color_name').querySelector('ul .swatchSelect');
                pId =  colorSelected.getAttribute('data-defaultasin');
            } else
                pId = document.querySelector('#averageCustomerReviews').getAttribute
                ('data-asin');
        } else {
            let urlArray = window.location.pathname.split('/');
            let indexDp = urlArray.indexOf("dp");
            if (typeof urlArray[indexDp + 1] == "undefined") {
                expToast("error", "Cant get source id!");
                return;
            } else
                pId = urlArray[++indexDp];
        }
        let images = [];
        document.querySelectorAll("#altImages .imageThumbnail input.a-button-input").forEach(function (el) {
            el.click();
        });
        document.querySelectorAll("#main-image-container li.image img").forEach(function (el) {
            let url = el.getAttribute("data-old-hires");
            if (isURL(url))
                images.push(url);
        });
        let banner = images.shift();
        let product = {
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "amazon"
        };
        console.log(product);
        this.push([product]);
    }
};
