let mhempearth = class extends Initial{
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
				if (document.querySelector('#productinfoBody')) {
					this.getProduct()
				}else if(document.querySelector('#indexBody'))
				{
					this.getProducts()

				}
				else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let container = document.querySelector('.productDetail-product ');
		let title = document.querySelector('h1.productDetail-tileName').textContent.trim();
		let banner;
		let images = [];
		document.querySelectorAll('#slide li').forEach(function(v, ){
			let imageUrl = v.querySelector('img').getAttribute('src');
			images.push(imageUrl);
		});
		banner = images.shift();
		let pId = null;
		pId = location.pathname;
		if (!pId) return;
		let tags = [];
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "mhempearth"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll('#Collection .producttile-list .product-item').forEach((el) => {
				let title = el.querySelector("a.product-item-link span").textContent;
				if (el.querySelector(".product-image img")) {
					let banner = el.querySelector(".product-image img").getAttribute('src');
					console.log(banner);
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector("a.product-item-link").getAttribute("href");
						pId = new URL(pId);
						pId = pId.pathname;
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "mhempearth"
						};
						products.push(product);
					}
				}
			}
		);
		console.log(products);
		this.push(products)
	}
};
