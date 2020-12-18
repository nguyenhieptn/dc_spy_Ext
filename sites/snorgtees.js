let Snorgtees = class {
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
        window.onload = function () {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    console.log()
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            })
        }
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
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
        this.pushProduct(callback, campaign_id, [product]);
    }

    pushProduct(callback, campaign_id, products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
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
        }
    }

}
