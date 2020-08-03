let Shopify = class {
    constructor() {
        this.domain = location.origin;
        this.href = location.href;
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
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (this.href.indexOf("/products/") !== -1) {
                this.getProduct((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            } else if (this.href.indexOf("/collections/") !== -1 || this.href.indexOf("/search") !== -1) {
                this.getProducts((data) => {
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            }
        });
    }

    getDOMProducts(callback, type, campaign_id) {
        let products = [];
        document.querySelectorAll('.product-wrap').forEach(function (_product) {
            let banner = new URL('https:' + _product.querySelector('.image__container img').getAttribute('src'))
            let pathName = banner.pathname;
            console.log(pathName);
            let fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
            if (fileName.lastIndexOf('_') != -1 && fileName.lastIndexOf('.') != -1)
            {
                fileName = fileName.slice(0,fileName.lastIndexOf('_')) + fileName.slice(fileName.lastIndexOf('.'), fileName.length);
                pathName = pathName.substring(0, pathName.lastIndexOf('/')+1);
                banner = banner.origin + pathName + fileName;
            }
            else
            {
                console.log(_product);
                banner = banner.origin + banner.pathname;
            }
            console.log(banner);
            let itemId = new URL(window.location.origin + _product.querySelector('a').getAttribute('href'))
            itemId = itemId.pathname.substring(itemId.pathname.lastIndexOf('/') + 1)
            let title = _product.querySelector('.hidden-product-link').textContent
            let product = {
                type: type,
                title: title,
                banner: banner,
                images: [],
                item_id: itemId,
                tags: [],
                store: location.host,
                market: "shopify"
            };
            products.push(product);
        })
        console.log(products);
        if (products.length == 0) {
            expToast("error", "No more product!");
            return;
        }
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

    getProducts(callback) {
        let paths = location.pathname.split("/");
        paths = paths.filter(Boolean);
        let keyword = paths[paths.length - 1];
        if (keyword.length === 0) {
            expToast("error", "No keywords found!");
            return;
        }
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
        if (window.location.pathname.indexOf('search') !== -1) {
            return this.getDOMProducts(callback, type, campaign_id);
        }
        let nUrl = location.protocol + location.host + location.pathname + "/products.json" + location.search;
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'GET',
            url: nUrl,
        }, function (responseText) {
            let data = JSON.parse(responseText);
            let products = [];
            let _products = data.products;
            _products.forEach((_product) => {
                let _images = _product.images;
                let images = [];
                _images.forEach((_image) => {
                    images.push(_image.src);
                });
                let banner = images.shift();
                let product = {
                    type: type,
                    title: _product.title,
                    banner: banner,
                    images: images,
                    item_id: _product.handle,
                    tags: [keyword],
                    store: location.host,
                    market: "shopify"
                };
                if (type === "shirt3d") {
                    let _variants = _product.variants;
                    let _options = _product.options;
                    let options = {};
                    _options.forEach((_option) => {
                        options["option" + _option.position] = {
                            name: _option.name,
                            values: _option.values
                        }
                    });
                    let variations = [];
                    let getVariant = (_variant, variations) => {
                        let _image = _variant.featured_image;
                        let key = "na";
                        let src = "";
                        if (_image != null && _image.id !== undefined) {
                            key = _image.id;
                            src = _image.src;
                        }
                        if (variations[key] === undefined) {
                            variations[key] = {
                                attributes: {},
                                image: src
                            }
                        }
                        let temp = variations[key];
                        if (temp.attributes === undefined) temp["attributes"] = {};
                        let attribute = temp["attributes"];
                        if (attribute["option1"] === undefined) attribute["option1"] = [];
                        if (attribute["option1"].indexOf(_variant.option1) === -1 && _variant.option1)
                            attribute["option1"].push(_variant.option1);
                        if (attribute["option2"] === undefined) attribute["option2"] = [];
                        if (attribute["option2"].indexOf(_variant.option2) === -1 && _variant.option2)
                            attribute["option2"].push(_variant.option2);
                        if (attribute["option3"] === undefined) attribute["option3"] = [];
                        if (attribute["option3"].indexOf(_variant.option3) === -1 && _variant.option3)
                            attribute["option3"].push(_variant.option3);
                        variations[key] = {
                            attributes: attribute,
                            image: src
                        };
                        return variations;
                    };
                    while (_variants.length > 0) {
                        let _variant = _variants.shift();
                        variations = getVariant(_variant, variations);
                    }
                    let nVariations = [];
                    for (let key in variations) {
                        let variation = variations[key];
                        let attributes = [];
                        let _attributes = variation.attributes;
                        if (_attributes.option1.length > 0)
                            attributes.push({
                                name: options.option1.name,
                                values: _attributes.option1
                            });
                        if (_attributes.option2.length > 0)
                            attributes.push({
                                name: options.option2.name,
                                values: _attributes.option2
                            });
                        if (_attributes.option3.length > 0)
                            attributes.push({
                                name: options.option3.name,
                                values: _attributes.option3
                            });
                        nVariations.push({
                            attributes: attributes,
                            image: variation.image
                        });
                    }
                    ;
                    product["variations"] = nVariations;
                }
                ;
                products.push(product);
            });
            if (products.length == 0) {
                expToast("error", "No more product!");
                return;
            }
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
        });
    }

    getProduct(callback) {
        // let keyword = document.querySelector("input[name=\"search_query\"]").value;
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let nUrl = location.protocol + location.host + location.pathname + ".json" + location.search;
        let images = [];
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'GET',
            url: nUrl,
        }, function (responseText) {
            let _product = JSON.parse(responseText);
            let _images = _product.image;
            let images = [];
            _images.forEach((_image) => {
                images.push(_image.src);
            });
            let product = {
                type: type,
                title: _product.title,
                banner: _product.image.src,
                images: images,
                item_id: _product.handle,
                tags: [],
                store: location.host,
                market: "shopify"
            };
            if (type === "shirt3d") {
                let _variants = _product.variants;
                let _options = _product.options;
                let options = {};
                _options.forEach((_option) => {
                    options["option" + _option.position] = {
                        name: _option.name,
                        values: _option.values
                    }
                });
                let variations = [];
                let getVariant = (_variant, variations) => {
                    let _image = _variant.featured_image;
                    let key = "na";
                    let src = "";
                    if (_image != null && _image.id !== undefined) {
                        key = _image.id;
                        src = _image.src;
                    }
                    if (variations[key] === undefined) {
                        variations[key] = {
                            attributes: {},
                            image: src
                        }
                    }
                    let temp = variations[key];
                    if (temp.attributes === undefined) temp["attributes"] = {};
                    let attribute = temp["attributes"];
                    if (attribute["option1"] === undefined) attribute["option1"] = [];
                    if (attribute["option1"].indexOf(_variant.option1) === -1 && _variant.option1)
                        attribute["option1"].push(_variant.option1);
                    if (attribute["option2"] === undefined) attribute["option2"] = [];
                    if (attribute["option2"].indexOf(_variant.option2) === -1 && _variant.option2)
                        attribute["option2"].push(_variant.option2);
                    if (attribute["option3"] === undefined) attribute["option3"] = [];
                    if (attribute["option3"].indexOf(_variant.option3) === -1 && _variant.option3)
                        attribute["option3"].push(_variant.option3);
                    variations[key] = {
                        attributes: attribute,
                        image: src
                    };
                    return variations;
                };
                while (_variants.length > 0) {
                    let _variant = _variants.shift();
                    variations = getVariant(_variant, variations);
                }
                let nVariations = [];
                for (let key in variations) {
                    let variation = variations[key];
                    let attributes = [];
                    let _attributes = variation.attributes;
                    if (_attributes.option1.length > 0)
                        attributes.push({
                            name: options.option1.name,
                            values: _attributes.option1
                        });
                    if (_attributes.option2.length > 0)
                        attributes.push({
                            name: options.option2.name,
                            values: _attributes.option2
                        });
                    if (_attributes.option3.length > 0)
                        attributes.push({
                            name: options.option3.name,
                            values: _attributes.option3
                        });
                    nVariations.push({
                        attributes: attributes,
                        image: variation.image
                    });
                }
                ;
                product["variations"] = nVariations;
            }
            ;
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
        });
    }
};