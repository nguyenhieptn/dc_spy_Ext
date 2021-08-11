let Walmart = class extends Initial{
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
            if (window.location.pathname.indexOf('search') !== -1) {
                that.getProducts()
            } else if (document.querySelector('#product-overview')) {
                that.getProduct();
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts() {
        let products = [];
        document.querySelectorAll(".search-result-gridview-items li").forEach((el) => {
            let elm = el.querySelector("div.orientation-square img");
            if (elm === null) {
                return;
            }
            let banner = elm.getAttribute("src");
            // banner = banner.replace("307.jpg", "5000.jpg");
            let images = [];
            if (!isURL(banner)) {
                return;
            } else {
                banner = new URL(banner);
                banner = banner.host + banner.pathname;
            }
            let title = elm.getAttribute("alt");
            let pId = el.querySelector(".search-result-productimage").getAttribute('href');
            let tags = [];
            let store = "walmart";
            let type = "";
            let product = {
                type: type,
                title: title,
                banner: banner,
                images: images,
                item_id: pId,
                tags: tags,
                store: store,
                market: "walmart"
            };
            products.push(product);
        });
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token:token
            },
            data:JSON.stringify({
                products:products,
                campaign_id:campaign_id
            })
        }, function(responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }

    getProduct() {
        let title = document.querySelector("#product-overview h1.prod-ProductTitle").innerText;
        let store = "walmart";
        let pId = location.pathname;
        let images = [];
        if (document.querySelectorAll(".ViewSelectorItem-image").length > 0)
            document.querySelectorAll(".ViewSelectorItem-image").forEach(function (el) {
                let image = el.getAttribute("src");
                image = image.replace('max_dim=65', 'max_dim=1000');
                images.push(image);
            });
        else if(document.querySelectorAll(".prod-ProductImage .product-core img").length > 0){
            document.querySelectorAll(".prod-ProductImage .product-core img").forEach(function (el) {
                let image = el.getAttribute("src");
                let url = new URL(el.src);
                image = url.origin+url.pathname;
                images.push(image);
            });
        }
        else {
            expToast("error", "Error crawl images!");
            return;
        }
        let banner = images.shift();
        let type = "";
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "walmart"
        };
        this.push([product])
    }
};
