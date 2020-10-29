let GrandMatee = class {
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
                if(document.getElementsByClassName('TagPage').length > 0 || document.getElementsByClassName('SearchPage').length > 0)
                {
                    that.getProducts((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    });
                } else if (document.getElementsByClassName('CampaignPage').length > 0) {
                    that.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else {
                    expToast("error", "Cant push product this page!");
                }
            })
        }
    }

    getProduct(callback) {
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
        let productContainer = document.getElementsByClassName('rightsidesmallbordered')[0].closest('.container').querySelector('.row');
        let locationBaseName = location.href.replace(/^.*\/|\.[^.]*$/g, '');
        let origin = location.href.slice(location.href.indexOf(locationBaseName), location.href.length);
        origin = location.href.replace(origin, '');
        let banner = productContainer.querySelector('.col-sm-6:first-child p[class="small"] a img');
        if(banner == null)
        {
            banner = productContainer.querySelector('.col-sm-6:first-child p[class="small"] img');
        }
        banner = banner.getAttribute('src');
        let bannerPath = banner.split('/')[0];
        let bannerBaseName = banner.replace(/^.*\/|\.[^.]*$/g, '');
        let bannerExtension = banner.split('.').pop();
        let hrefBanner = productContainer.querySelectorAll('.col-sm-6:first-child p[class="small"] a');
        for (let i = 0; i < hrefBanner.length; i++) {
            let otherSize = hrefBanner[i].getAttribute('href');
            if (otherSize.indexOf('_xxlg') !== -1) {
                if (bannerBaseName.indexOf('_xlg') !== -1)
                    bannerBaseName = bannerBaseName.replace('_xlg', '');
                bannerBaseName = bannerBaseName + '_xxlg';
                break;
            }
            if (otherSize.indexOf(!('_xlg' === -1)) && bannerBaseName.indexOf('_xlg') === -1) {
                bannerBaseName = bannerBaseName + '_xlg';
            }
        }
        banner = [bannerPath, bannerBaseName + '.' + bannerExtension].join('/');
        banner = origin + banner;
        let pId;
        pId = location.pathname;
        let title = productContainer.querySelector('.col-sm-6:last-child h3').textContent;
        let images = [];
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            tags: [],
            store: location.host,
            market: 'impawards',
        };
        // let altDesign = productContainer.querySelector('.col-sm-6:first-child div[id="altdesigns"]')
        // if (altDesign != null) {
        // 	let designs = altDesign.querySelectorAll('a');
        // 	designs = Array.from(designs);
        // 	this._getProduct(callback, campaign_id, product, designs, origin);
        // } else
        this.pushProduct(callback, campaign_id, [product]);
    }

    getProducts(callback) {
        expToast("error", "Cant push product this page!");
        return;
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
        let retailProductList = document.querySelector('.RetailProductList');
        if(retailProductList === null)
        {
            expToast("error", "Cant push product this page!");
            return;
        }
        else
        {
            let items = retailProductList.querySelectorAll('div div div');
            console.log(items);
        }
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

    subXhrGetProducts(callback, campaign_id, type, productUrl) {
        let that = this;
        let products = [];
        chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: productUrl,
            }, function (responseText) {
                let res_data = JSON.parse(responseText);
                let data = res_data.data;
                if (data.length > 0) {
                    let temp_products = [];
                    data.forEach(function (v, k) {
                        let imageUrl = new URL(v.imageUrl);
                        let pathName = imageUrl.pathname.split('/');
                        pathName[1] = '857x1200';
                        pathName = pathName.join('/');
                        let banner = imageUrl.origin + pathName;
                        let images = [];
                        let tags = [];
                        // if (typeof v.images != "undefined")
                        //     if (v.images.length > 1)
                        //         v.images.forEach(function (value, key) {
                        //             images.push(value.src)
                        //         });
                        temp_products.push({
                            type: type,
                            title: v.title,
                            banner: banner,
                            images: images,
                            item_id: v.itemCollectionId,
                            tags: tags,
                            store: location.host,
                            market: 'displate'
                        })
                    });
                    products = products.concat(temp_products);
                    // console.log(products);
                    that.pushProduct(callback, campaign_id, products);
                }
            }
        )
        ;
    }
}
