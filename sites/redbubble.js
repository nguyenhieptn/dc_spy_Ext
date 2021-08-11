let Redbubble = class extends Initial{
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
            if (document.querySelector('div[class^="DesktopProductPage__wrapper"]')) {
                console.log("product");
                that.getProduct();
            } else {
                that.getProducts();
            }
        });
    }

    getProducts() {
        let keyword = document.querySelector("input[type=\"search\"]").value;
        let products = [];
        document.querySelectorAll("#SearchResultsGrid > a").forEach((el) => {
            let elm = el.querySelector("img[class*=\"styles__productImage\"]");
            let banner = elm.getAttribute("src");
            if (!isURL(banner)) return;
            let title = elm.getAttribute("alt");
            let url = new URL(el.getAttribute("href"));
            let pId = url.pathname;
            let tags = [];
            if (keyword !== "")
                tags.push(keyword);
            let store = "";
            if (el.querySelector("span[class*=\"styles__body2\"]"))
                store = el.querySelector("span[class*=\"styles__body2\"]").innerText.replace("By ", "");
            else {
                let artist = document.querySelector("div[class*=\"ArtistHeader__artistInfoContent\"]")
                store = artist.querySelector('div[class*="ArtistHeader__artistName"] h1').innerText;
            }
            let product = {
                type: "",
                title: title,
                banner: banner,
                item_id: pId,
                tags: tags,
                store: store,
                market: "redbubble"
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }

    getProduct() {
        let title = document.querySelector("[class*=\"ArtworkDetails__workTitle\"] strong").innerText;
        let store = document.querySelector("[class*=\"ArtworkDetails__artistLink\"]").innerText;
        let pId = location.pathname;
        let images = [];
        document.querySelectorAll("[class*=\"GalleryImage__img\"]").forEach(function (el) {
            images.push(el.getAttribute("src"));
        });
        let banner = images.shift();
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        let product = {
            type: "",
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "redbubble"
        };
        console.log(product);
        this.push([product]);
    }
};
