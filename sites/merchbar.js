let MerchBar = class {
    constructor() {
        this.domain = location.origin;
        this.href = location.href;
        this.init();
    }

    init() {
        if (document.querySelector('.exp-template') === null) {
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
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if (document.querySelector('div[class^="merch_merchDetails"]')) {
                    this.getProduct((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else if (document.querySelector('div[class^="SearchInterface_productsContainer"]')) {
                    this.getProducts((data) => {
                        button.classList.remove("is-loading");
                        if (data.status === "succeed") {
                            expToast("success", "Push Successfully!");
                        } else {
                            expToast("error", data.msg);
                        }
                    })
                } else
                    expToast("error", 'Cant crawl this page!');
            });
        }
    }

    getProduct(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let url = "https://www.merchbar.com/webapi/merch/";
        let productSlug = location.href.substring(this.href.lastIndexOf('/') + 1)
        url = url + productSlug;
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'GET',
            url: url,
        }, function (responseText) {
            let data = JSON.parse(responseText).merch;
            let images = [];
            console.log(data.photos);
            data.photos.forEach(function (value, key) {
                let imageUrl = new URL(value.url);
                imageUrl = imageUrl.origin + imageUrl.pathname;
                images.push(imageUrl);
            })
            let banner = images.shift();
            console.log(banner);
            let product = {
                type: "",
                title: data.title,
                banner: banner,
                item_id: location.pathname,
                tags: data.tags,
                images: images,
                store: location.host,
                market: "merchbar"
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
        });
    }

    getProducts(callback) {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        console.log(campaign_id);
        if (campaign_id === "" || campaign_id === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let json = JSON.parse(document.querySelector('script#__NEXT_DATA__').innerText);
        let runtimeConfig = json.runtimeConfig;
        let api = runtimeConfig.ALGOLIA_API_KEY;
        let appId = runtimeConfig.ALGOLIA_APP_ID;
        let brandId = null;
        if (document.querySelector('div.brand-view input')) {
            brandId = document.querySelector('div.brand-view input').getAttribute('value');
        }
        let query = null;
        if (location.pathname.indexOf('search')) {
            let cUrl = new URL(location.href);
            query = cUrl.searchParams.get('q');
        }
        let facetFilters = null;
        if (location.search.indexOf('dfr')) {
            facetFilters = "[";
            let json = this.QueryParamsToJSON(new URL(decodeURI(location.href)));
            let genres = [];
            let tags = [];
            let brands = []
            for (const [key, value] of Object.entries(json)) {
                if (key.indexOf('dFR[genre]') !== -1) {
                    genres = value;
                } else if (key.indexOf('dFR[tags]') !== -1) {
                    tags = value;
                } else if (key.indexOf('dFR[brand]') !== -1) {
                    brands = value;
                }
            }
            if (brands.length > 0) {
                let _brands = '[';
                brands.forEach(function (v, k) {
                    _brands += '"brand:' + v + '"';
                    if (typeof brands[++k] !== 'undefined') {
                        _brands += ",";
                    }
                })
                _brands += ']';
                facetFilters += _brands;
            }
            if (tags.length > 0) {
                let _tags = '[';
                if (brands.length > 0) {
                    _tags = ',[';
                } else {
                    _tags = '[';
                }
                tags.forEach(function (v, k) {
                    _tags += '"tags:' + v + '"';
                    if (typeof tags[++k] !== 'undefined') {
                        _tags += ",";
                    }
                });
                _tags += ']';
                console.log(_tags);
                facetFilters += _tags;
            }
            if (genres.length > 0) {
                let _genres;
                if (tags.length > 0 || brands.length > 0) {
                    _genres = ',[';
                } else {
                    _genres = '[';
                }
                genres.forEach(function (v, k) {
                    _genres += '"genre:' + v + '"';
                    if (typeof genres[++k] !== 'undefined') {
                        _genres += ",";
                    }
                })
                _genres += ']';
                facetFilters += _genres;
            }
            facetFilters += "]";
            console.log(facetFilters);
        }
        return this.fetchProduct(callback, campaign_id, appId, api, brandId, facetFilters, query);
    }

    QueryParamsToJSON(url) {
        var list = url.search.slice(1).split('&'),
            result = {};

        list.forEach(function (keyval) {
            keyval = keyval.split('=');
            var key = keyval[0];
            if (/\[[0-9]*\]/.test(key) === true) {
                var pkey = key.split(/\[[0-9]*\]/)[0];
                if (typeof result[pkey] === 'undefined') {
                    result[pkey] = [];
                }
                result[pkey].push(decodeURIComponent(keyval[1] || ''));
            } else {
                result[key] = decodeURIComponent(keyval[1] || '');
            }
        });
        return JSON.parse(JSON.stringify(result));
    }

    fetchProduct(callback, campaign_id, appId, api, brandId = null, facetFilters = [], query = null, products = [], page = 0, limit = 100,) {
        let that = this;
        let params = "highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&filters=";
        let params1 = "highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&filters=";
        if (brandId) {
            params += "brandID:" + brandId;
            params1 += "brandID:" + brandId;
        }
        params += "&hitsPerPage=" + limit;
        params1 += "&hitsPerPage=" + limit;
        params += "&query=";
        params1 += "&query=";
        if (query) {
            params += query;
            params1 += query;
        }
        params += "&page=" + page;
        params1 += "&page=" + page;
        params += "&maxValuesPerFacet=15&facets=%5B%22featured_filters%22%2C%22brand%22%2C%22tags%22%2C%22genre%22%2C%22sizes%22%2C%22effective_price%22%2C%22status_name%22%5D&tagFilters=&";
        params1 += "&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&";
        if (facetFilters.length > 0) {
            facetFilters = encodeURIComponent(facetFilters);
            params += "facetFilters=" + facetFilters + "&";
            params1 += "facetFilters=" + facetFilters + "&";
        }
        params += "numericFilters=%5B%22effective_price%3E%3D0%22%2C%22effective_price%3C%3D30000%22%5D";
        params1 += "analytics=false&clickAnalytics=false&facets=effective_price"
        console.log(params);
        console.log(params1);
        let indexName = 'Merch';
        console.log(page);
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: "https://y0oirxd0rf-dsn.algolia.net/1/indexes/*/queries?x-algolia-application-id=" + appId + "&x-algolia-api-key=" + api,
            data: JSON.stringify({
                requests: [
                    {
                        "indexName": indexName,
                        "params": params
                    },
                    {
                        "indexName": indexName,
                        "params": params1
                    }
                ]
            })
        }, function (responseText) {
            let data = JSON.parse(responseText).results[0].hits;
            data.forEach(function (v, k) {
                let images = [];
                if (v.type === "merch" && v.photos !== undefined) {
                    v.photos.forEach(function (value, key) {
                        let imageUrl = new URL(value);
                        imageUrl = imageUrl.origin + imageUrl.pathname;
                        images.push(imageUrl);
                    })
                    let banner = images.shift();
                    console.log(banner);
                    let pid = new URL(v.url);
                    pid = pid.pathname;
                    products.push({
                        type: "",
                        title: v.name,
                        banner: banner,
                        images: images,
                        item_id: pid,
                        tags: v.tags,
                        store: location.host,
                        market: "merchbar   ",
                    })
                }
            })
            if (data.length === limit) {
                setTimeout(function () {
                    return that.fetchProduct(callback, campaign_id, appId, api, brandId, facetFilters, query, products, ++page, limit = 100,);
                }, 3000);
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
        });
    }
};