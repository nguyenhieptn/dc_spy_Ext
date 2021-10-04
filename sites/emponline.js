let Emponline = class extends Initial {
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
      if (document.querySelector(".product-content")) {
        this.getProduct()
      } else if (document.getElementsByClassName('.content')) {
        this.getProducts()
      } else
        expToast("error", 'Cant crawl this page!');
    });
  }

  getProduct() {
    let title = document.querySelector("div.product-name h1").innerText.trim();
    let images = [];
    let banner;
    document.querySelectorAll(".product-image-container img").forEach(function(v, k) {
      let imgUrl = v.getAttribute('src');
      imgUrl = imgUrl.replace("sw=255&sh=250", "sw=1000&sh=800");
      images.push(imgUrl);
    });
    banner = images.shift();
    let pId = location.pathname;
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
      market: "emponline"
    };
    console.log(product);
    this.push([product])
  }

  getProducts() {
    let products = [];
    let containerProducts;
    containerProducts = document.querySelectorAll('.content .grid-tile')
    containerProducts.forEach((el) => {
      if (el.querySelector('.product-image img')) {
        let title = el.querySelector('.product-image img').getAttribute('alt');
        let banner = el.querySelector('.product-image img').getAttribute('src');
        banner = banner.replace("sw=255&sh=250", "sw=1000&sh=800");
        let images = [];
        let pId = el.querySelector('a.product-link').getAttribute('href');
        let tags = [];
        let product = {
          type: "",
          title: title,
          banner: banner,
          item_id: pId,
          tags: tags,
          store: location.host,
          market: "emponline",
        };
        products.push(product);
      }
    });
    console.log(products);
    this.push(products);
  }
};
