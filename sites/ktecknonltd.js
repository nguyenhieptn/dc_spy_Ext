let Ktecknonltd = class extends Initial{
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
				if (document.querySelector('body#productinfoBody')) {
					this.getProduct()
				}else if(document.querySelector('#indexCategories'))
				{
					this.getProducts()
				}
				else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct(callback) {
		let container = document.querySelector('.productDetail-product');
		let title = container.querySelector('h1.productDetail-tileName').innerText;
		let banner;
		let images = [];
		document.querySelectorAll('#pdp-image-scroll li').forEach(function(v, ){
			images.push(v.querySelector('img').getAttribute('src'));
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
			market: "Ktecknonltd"
		};
		this.push([product]);
	}

	getProducts(callback) {
		let products = [];
		document.querySelectorAll('#Collection .producttile-list .product-item').forEach((el) => {
				let title = el.querySelector("a.product-item-link span").textContent;
				if (el.querySelector(".imge img")) {
					let banner = el.querySelector(".imge img").getAttribute('src');
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
							market: "Ktecknonltd"
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
