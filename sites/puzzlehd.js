let Puzzlehd = class {
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
        let select = document.createElement("select");
        select.name = "product_type";
        select.classList.add("exp-select");
        let option = document.createElement("option");
        option.value = "";
        option.innerText = "Select Type";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "mug";
        option.innerText = "Mug";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "shirt";
        option.innerText = "Shirt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "quilt";
        option.innerText = "Quilt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "shirt3d";
        option.innerText = "3D Shirt";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "mask";
        option.innerText = "Mask";
        select.appendChild(option);
        option = option.cloneNode();
        option.value = "other";
        option.innerText = "Other";
        select.appendChild(option);
        template.appendChild(select);
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
                that.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            })
        }
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if (type.length === 0) {
            expToast("error", "Please select type!");
            return;
        }
        let url = window.location;
        let search, productUrl, startId = null;
        if (url.pathname.includes('search')) {
            let query = url.pathname.split("/");
            if (typeof query[query.indexOf("search") + 1] != "undefined") {
                search = 'term=' + query[query.indexOf("search") + 1];
            }
            if(window.location.search.indexOf('startId=') != -1)
            {
                startId = window.location.search.replace('?startId=', "");
                console.log(startId);
            }
            productUrl = url.origin + '/api/product/v3/products/search?' + search + '&startId='+startId+"&";
        } else
            productUrl = url.origin + '/api/product/v3/products?';
        let products = [];
        this.subXhrGetProducts(callback, campaign_id, type, productUrl);

    }

    pushProduct(callback, campaign_id, products) {
        if (products.length == 0) {
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

    subXhrGetProducts(callback, campaign_id, type, productUrl, limit = 50, page = 1, products = []) {
        let that = this;
        chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: productUrl + 'limit=' + limit + '&page=' + page,
            }, function (responseText) {
                let res_data = JSON.parse(responseText);
                let data = res_data.data;
                let data_products = data.products;
                if (data_products.length > 0 && res_data.success) {
                    let temp_products = [];
                    data_products.forEach(function (v, k) {
                        let banner = v.thumbnail;
                        let images = [];
                        if (typeof v.images != "undefined")
                            if (v.images.length > 1)
                                v.images.forEach(function (value, key) {
                                    images.push(value.src)
                                });
                        temp_products.push({
                            type: type,
                            title: v.title,
                            banner: banner,
                            images: images,
                            item_id: v.slug,
                            tags: v.tags,
                            store: location.host,
                            market: 'sbsdk'
                        })
                    });
                    if (data_products.length == limit) {
                        products = products.concat(temp_products);
                        setTimeout(function () {
                            return that.subXhrGetProducts(callback, campaign_id, type, productUrl, limit, ++page, products);
                        }, 5000);
                    } else if (data_products.length < limit) {
                        products = products.concat(temp_products);
                        that.pushProduct(callback, campaign_id, products);
                    } else
                        that.pushProduct(callback, campaign_id, products);
                }
            }
        )
        ;
    }
}
