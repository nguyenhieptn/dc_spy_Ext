let Ubuy = class extends Initial{
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
				if (document.querySelector('#product-view-full')) {
					this.getProduct()
				} else if (document.querySelector('.category-page')) {
					this.getProducts();
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector("h1.title").innerText;
		let images = [];
		document.querySelectorAll("div.slick-list .slick-track .thumbnail-image img").forEach(function (v, k) {
			let imgUrl = v.getAttribute('src');
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
		let elm = document.querySelector("ul.elementor-post-info");
		let tags = [];
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "ubuy"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll("#usstore-products .product-list").forEach((el) => {
				let title = el.querySelector(".product-image a.goos-tag-product").getAttribute('title');
				if (el.querySelector(".product-image a.goos-tag-product")) {
					let banner = el.querySelector(".product-image a.goos-tag-product img").getAttribute("src");
					banner = banner.replace('US218', "");
					let pId = new URL(el.querySelector(".product-image a.goos-tag-product").getAttribute('href'));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.pathname,
						tags: tags,
						store: location.host,
						market: "ubuy"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products)
	}
};
