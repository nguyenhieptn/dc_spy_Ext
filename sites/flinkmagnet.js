let Flinkmagnet = class extends Initial {
  constructor() {
    super();
    this.domain = location.origin;
    this.href = location.href;
    this.build()
    this.init();
  }

  init() {
    let button = document.querySelector('button.exp-btn-push');
    button.addEventListener("click", (e) => {
      e.preventDefault();
      button.classList.add("is-loading");
      if (document.querySelector("#productinfoBody")) {
        this.getProduct()
      } else if (document.getElementsByClassName('searchEngineRightDiv')) {
        this.getProducts()
      } else
        expToast("error", 'Cant crawl this page!');
    });
  }

  getProduct() {
    let title = document.querySelector(".productDetail-tileName").innerText.trim();
    let images = [];
  	let banner;
    if (document.querySelectorAll("#slide img").length > 0) {
      document.querySelectorAll("#slide img").forEach(function(v, k) {
        let imgUrl = v.getAttribute('src_date');
        images.push(imgUrl);
      });
      banner = images.shift();
    }
		else {
			banner = document.querySelector(".productDetail-imageContainer img").getAttribute('src');
		}
    if (!isURL(banner)) {
      expToast("error", "Cant get image!");
      return;
    }
    let pId = document.querySelector('link[rel="canonical"]').getAttribute('href');
    if (!pId) return;
    let tags = [];
    let product = {
      type: "",
      title: title,
      banner: banner,
      item_id: pId,
      tags: tags,
      images: images,
      store: location.host,
      market: "flinkmagnet"
    };
    console.log(product);
    this.push([product])
  }

  getProducts() {
    let products = [];
    let containerProducts;
    containerProducts = document.querySelectorAll('#Collection .product-item')
    containerProducts.forEach((el) => {
      if (el.querySelector('img.photo')) {
        let title = el.querySelector('img.photo').getAttribute('alt');
        let banner = el.querySelector('img.photo').getAttribute('src');
        let images = [];
        let pId = el.querySelector('a.product-item-photo').getAttribute('href');
        let tags = [];
        let product = {
          type: "",
          title: title,
          banner: banner,
          item_id: pId,
          tags: tags,
          store: location.host,
          market: "flinkmagnet",
        };
        products.push(product);
      }
    });
    console.log(products);
    this.push(products);
  }
};
