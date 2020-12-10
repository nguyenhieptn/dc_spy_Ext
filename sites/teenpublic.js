let TeenPublic = class {
    constructor() {
        this.domain = location.origin;
        this.init();
    }

    init() {
        let template = document.createElement("div");
        template.classList.add("exp-template");
        if (document.querySelector('.jsProductImgGlideCtrls')) {
            let select = document.createElement("select");
            select.classList.add('exp-input');
            select.setAttribute('id', 'exp-banner-type');
            select.style.width = '100%';
            let optionArt = document.createElement("option");
            optionArt.value = 'art';
            optionArt.textContent = 'Art';
            select.appendChild(optionArt);
            let option = document.createElement("option");
            option.value = 'front';
            option.textContent = 'Front';
            select.appendChild(option);
            template.appendChild(select);
        }
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
            if (document.querySelector('section.m-search__designs')) {
                console.log("product");
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (document.querySelector('.m-design__content')) {
                that.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                });
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts(callback) {
        let products = [];
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        document.querySelectorAll(".jsDesignContainer").forEach((el) => {
            let elm = el.querySelector(".m-tiles__design a img");
            let banner = elm.getAttribute("src");
            if (!isURL(banner)) return;
            let title = elm.getAttribute("alt");
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
        // chrome.runtime.sendMessage({
        //     action: 'xhttp',
        //     method: 'POST',
        //     url: DataCenter + "/api/campaigns/products",
        //     headers: {
        //         token:token
        //     },
        //     data:JSON.stringify({
        //         products:products,
        //         campaign_id:campaign_id
        //     })
        // }, function(responseText) {
        //     let data = JSON.parse(responseText);
        //     callback(data);
        // });
        console.log(products);
    }

    getProduct(callback) {
        let title = document.querySelector(".m-design__content .m-design__title h1").innerText;
        let store = "teepublic";
        let pId = location.href.substr(25);
        let images = [];
        if (document.querySelector(".m-product-preview__thumbs"))
            document.querySelector(".m-product-preview__thumbs").querySelectorAll('div.jsProductPreviewThumb img').forEach(function (el) {
                images.push(el.getAttribute("src"));
            });
        else return;
        let banner;
        if (document.querySelector('#exp-banner-type') && document.querySelector('#exp-banner-type').value === 'art') {
            banner = images.pop();
        }
        else
            banner = images.shift();
        let type = "";
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
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
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: [product],
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }
};