let Klaviyo = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    host = document.querySelector('#exp-embed').getAttribute('data-host');
    token = document.querySelector('#exp-embed').getAttribute('data-token');

    init() {

        let button = document.querySelector('button.exp-btn-push')
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.getElementById('search') || (document.getElementById('collection'))) {
                that.getProducts()
            } else if (document.getElementById('product') || document.querySelector('div.product-template')) {
                that.getProduct()
            } else {
                expToast("error", "cant push this page!!");
            }
        })
    }

    getProduct() {
        if (window.hasOwnProperty('sb_product')) {
            let productId = window.sb_product.id;
            let productUrl = window.location.origin + '/api/catalog/products_v2.json?ids=' + productId;
            let xhttp = new XMLHttpRequest();
            let that = this;
            xhttp.onload = function () {
                let res = JSON.parse(xhttp.responseText);
                if (res.hasOwnProperty('products')) {
                    if (res.products.length > 0) {
                        let products = res.products;
                        let banner = products[0].images[0].src;
                        let images = [];
                        if (products[0].images.length > 1)
                            products[0].images.forEach(function (value, key) {
                                images.push(value.src)
                            });
                        let product = {
                            type: "",
                            title: products[0].title,
                            banner: banner,
                            images: images,
                            item_id: products[0].handle,
                            tags: products[0].tags,
                            store: location.host,
                            market: "shopbase",
                        }
                        console.log(product);
                        that.pushProducts([product]);
                    } else {
                        expToast("error", "Product not found!");
                    }
                } else {
                    console.log(JSON.parse(xhttp.responseText));
                    expToast("error", JSON.parse(xhttp.responseText).error);
                }
            };
            xhttp.onerror = function () {
                console.log(xhttp);
                expToast(xhttp.responseText.error);
            };
            xhttp.open("GET", productUrl, true);
            xhttp.send();
        } else {
            expToast("error", "cant find product in this page!!");
        }
    }

    getProducts() {
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        if (document.getElementById('search')) {
            this.getProductsInSearchPage();
        } else if (document.getElementById('collection')) {
            this.getProductsInCollectionPage();
        } else {
            expToast("error", "cant push this page!!");
        }
    }

    getProductsInCollectionPage() {
        let url = window.location;
        let collection_id = null;
        if (window.__INITIAL_STATE__.collection.collection.id !== undefined) {
            collection_id = window.__INITIAL_STATE__.collection.collection.id;
        }
        if (collection_id) {
            let productUrl = url.origin + '/api/catalog/products_v2.json' + '?collection_ids=' + collection_id + '&';
            this.apiGetProducts( productUrl);
        } else {
            let productUrl = url.origin + '/api/catalog/products_v2.json?';
            this.apiGetProducts(productUrl);
            // expToast("error", "Cant push this page!");
            return;
        }
    }

    getProductsInSearchPage() {
        let url = window.location;
        let search, productUrl;
        if (typeof url.search != "undefined" && typeof url.search !== undefined && url.search !== "") {
            search = url.search;
            productUrl = url.origin + '/api/catalog/products_v2.json' + search + '&';
        } else if (url.hostname === 'www.auzaras.com') {
            productUrl = url.origin + '/api/catalog/products_v2.json?';
        } else {
            expToast("error", "Cant push this page!");
            return;
        }
        this.apiGetProducts(productUrl);
    }

    apiGetProducts( productUrl, limit = 50, page = 1, products = []) {
        let that = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status === 400) {
                that.pushProducts(callback, campaign_id, products);
            }
            let res = JSON.parse(xhttp.responseText);
            if (res.hasOwnProperty('products')) {
                if (res.products.length > 0) {
                    let resProducts = res.products;
                    let temp_products = [];
                    resProducts.forEach(function (v, k) {
                        if (typeof v.images == "undefined" || typeof v.images === undefined)
                            return;
                        let banner = v.images[0].src;
                        let images = [];
                        if (v.images.length > 1)
                            v.images.forEach(function (value, key) {
                                images.push(value.src)
                            });
                        temp_products.push({
                            type: "",
                            title: v.title,
                            banner: banner,
                            images: images,
                            item_id: v.handle,
                            tags: v.tags,
                            store: location.host,
                            market: "shopbase",
                        })
                    });
                    products = products.concat(temp_products);
                    if (resProducts.length === limit) {
                        setTimeout(function () {
                            return that.apiGetProducts(productUrl, limit, ++page, products);
                        }, 5000);
                    } else
                    {
                        that.pushProducts(products);
                    }
                } else {
                    if (products.length > 0) {
                        that.pushProducts(products);
                    } else
                        expToast("error", "Products not found!");
                }
            } else {
                console.log(xhttp);
                expToast("error", JSON.parse(xhttp.responseText).error);
            }
        };
        xhttp.onerror = function () {
            expToast(xhttp.responseText.error);
        };
        xhttp.open("GET", productUrl + 'limit=' + limit + '&page=' + page, true);
        xhttp.send();
    }

    async pushProducts(products) {
        let that = this;
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            let _product = [];
            for (const product of products) {
              const _udpated = await this.updateImages(product);
              _product.push(product);
            }
            products = _product;
            while(products.length > 0)
            {
                let dataPush = products.splice(0, 20);
                that.showMessage({msg:'Schedule push product! Dont close this tab'}, 'success');
                document.querySelector('.exp-btn-push').classList.remove('is-loading');
                setTimeout(function(){
                    that.push(dataPush, campaign_id)
                }, 800);
            }

        }
    }

    push = function(products, campaign_id){
        console.log(products);
        let url = this.host + "/api/campaigns/products";
        let that = this;
        if(url.indexOf('https://') === -1)
        {
            url = "https://"+url;
        }
        fetch(url, 
        {
            method: "POST",
            body: {
                products: products,
                campaign_id: campaign_id
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'token': that.token,
            },
        }
        ).then(function(res){ return res.json(); })
        .then(function(data){ that.showMessage(data, 'error')});
    }

    getBlob = async function(url) {
      let that = this;
      return fetch(url).then(response => response.blob())
        .then(async function(blob) {
          console.log(blob);
          return await that.blobToBase64(blob);
        })
    }

    blobToBase64 = blob => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
  });

    updateImages = async function(product) {
      let banner = await this.getBlob(product.banner);
      product.banner = banner;
      if(product.images !== undefined && product.images.length > 0)
      {
        let _images = [];
        let count = 0;
        for(const image of product.images)
        {
          let img = await this.getBlob(image);
          _images.push(img);
          count++;
          if (count == 5) {
            break;
          }
        }
        product.images = _images;
      }
    }


    showMessage(message, type)
    {
        expToast(type, message.msg);
    }
}
new Klaviyo();

function expToast(type, msg) {
    let x = document.getElementById("exp-snackbar");
    x.innerText = msg;
    x.className = "";
    x.classList.add("show");
    x.classList.add(type);
    setTimeout(function () {
        x.className = "";
    }, 3000);
}
