let Vitelegacy = class extends Initial{
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build();
		this.init();
	}

	init() {
		if (document.querySelector('.exp-template') !== null) {
			let button = document.querySelector('button.exp-btn-push')
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.querySelector('.product-template') || document.querySelector('.product-page-template')) {
					this.getProduct()
				} else if (location.pathname.indexOf('collections') === 1 || location.pathname.indexOf('search') === 1) {
					this.getProducts();
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector(".product__name").innerText;
		let images = [];
		document.querySelectorAll(".media-gallery-carousel__thumbs img, .thumbnail-carousel img").forEach(function (v, k) {
			let imgUrl = v.getAttribute('data-zoom');
			images.push(imgUrl);
		});
		let banner = images.shift();
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let pId = null;
		pId = location.pathname;
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
			market: "vitelegacy"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll(".collection-product-wrap").forEach((el) => {
				let title = el.querySelector(".title").innerText.trim();
				if (el.querySelector('.collection-image-container img')) {
					let banner;
          let images = [];
          el.querySelectorAll('.collection-image-container img').forEach(function(val, key){
            images.push(val.getAttribute('data-zoom'))
          })
					banner = images.shift();
					let pId = el.querySelector("a").getAttribute('href');
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
            images: images,
						item_id: pId,
						tags: tags,
						store: location.host,
						market: "vitelegacy"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products)
	}
};
