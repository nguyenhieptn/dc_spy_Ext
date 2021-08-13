let Rdynolabs = class extends Initial{
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build();
		this.init();
	}

	init() {
		if (document.querySelector('.exp-template') === null) {
			let button = document.querySelector('button.exp-btn-push')
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.querySelector('div.productDetail-productSection')) {
					this.getProduct()
				} else if (document.querySelector('#Collection')) {
					this.getProducts()
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector("h1.productDetail-tileName").innerText;
		let images = [];
		let banner;
		if(document.querySelectorAll('ul#slide li').length >0)
		{
			document.querySelectorAll('ul#slide li a img').forEach(function (v, k) {
				let imgUrl = v.getAttribute('src');
				images.push(imgUrl);
			});
			banner = images.pop();
		}
		else
		{
			banner = document.querySelector('div.picZoomer-pic-wp img').getAttribute('src');
		}
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
			market: "rdynolabs"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll("#Collection .producttile-list .product-item").forEach((el) => {
				let title = el.querySelector(".product-item-link span").textContent;
				if (el.querySelector("a.product-item-photo img.photo")) {
					let banner = el.querySelector("a.product-item-photo img.photo").getAttribute("src");
					let pId = new URL(el.querySelector("a.product-item-link ").getAttribute('href'));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.pathname,
						tags: tags,
						store: location.host,
						market: "rdynolabs"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
