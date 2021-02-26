let Redbubble = class {
    constructor() {
        this.domain = location.origin;
        this.init();
    }

    init() {
        let template = document.createElement("div");
        template.classList.add("exp-template");
        let input = document.createElement("input");
        input.name = "campaign_id";
        input.placeholder = "Campaign ID";
        input.classList.add("exp-input");
        template.appendChild(input);
        let button = document.createElement("button");
        button.classList.add("exp-btn");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('div[class^="DesktopProductPage__wrapper"]')) {
                console.log("product");
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else {
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                });
            }
        });
    }

    getProducts(callback) {
        let keyword = document.querySelector("input[type=\"search\"]").value;
        let products = [];
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
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
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: products,
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
        console.log(products.length);
    }

    getProduct(callback) {
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
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/product",
            headers: {
                token: token
            },
            data: JSON.stringify({
                product: product,
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }
};