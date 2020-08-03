let Displate = class {
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
                if (document.getElementById('react-product-page')) {
                    that.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    });
                } else if (document.getElementById('collection-page') || window.location.pathname.indexOf('sr-artworks') != -1)
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
        let productContainer = document.getElementsByClassName('product-page-actions-container')[0];
        let title = productContainer.querySelector('h1.heading-3').textContent;
        let productSlice = document.getElementsByClassName('product-page-image-slider-container')[0];
        let firstImage = productSlice.querySelector('.nav-btn-box').firstChild;
        let imageUrl = firstImage.querySelector('img').getAttribute('src');
        imageUrl = new URL(imageUrl);
        let pathName = imageUrl.pathname.split('/');
        let filename = pathName[pathName.length - 1];
        let banner = location.origin + '/displates/' + filename;
        let pId = window.location.pathname.split('/');
        pId = pId[pId.length-1];
        let products = [{
            type: type,
            title: title,
            banner: banner,
            images: [],
            item_id: pId,
            tags: [],
            store: location.host,
            market: 'displate'
        }];
        this.pushProduct(callback, campaign_id, products);
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
        let pathName = window.location.pathname.split('/');
        console.log(pathName);
        let productUrl, page;
        if (pathName.indexOf('sr-artworks') != -1) {
            let search;
            search = pathName[pathName.indexOf('sr-artworks') + 1];
            console.log(search);
            page = typeof pathName[pathName.indexOf('sr-artworks') + 2] != undefined ? pathName[pathName.indexOf('sr-artworks') + 2] : null;
            if (page) {
                productUrl = 'https://sapi.displate.com/search/artworks?miso=US&phrase=' + search + '&size=64&page=' + page
            } else
                productUrl = 'https://sapi.displate.com/search/artworks?miso=US&phrase=' + search + '&size=64';
        } else {
            if (document.querySelector('[data-collection-id]')) {
                let collectionId = document.querySelector('[data-collection-id]').getAttribute('data-collection-id');
                let checkPage = parseInt(pathName[pathName.length - 1]);
                page = isNaN(checkPage) ? null : checkPage;
                if (page) {
                    productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64&page=' + page;
                } else
                    productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64';
            }
        }
        console.log(productUrl);
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
                        let imageUrl = new URL(v.imageUrl)
                        let pathName = imageUrl.pathname.split('/');
                        let filename = pathName[pathName.length - 1];
                        let banner = location.origin + '/displates/' + filename
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
