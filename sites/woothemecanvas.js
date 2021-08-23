let WooThemeCanvas = class extends Initial{
	constructor() {
		super()
		this.domain = location.origin;
		this.href = location.href;
		this.build();
		this.init();
	}

	init() {
		if (document.querySelector('.exp-template') !== null) {
			let button = document.querySelector('button.exp-btn-push');
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.querySelector('body.single-product')) {
					this.getProduct()
				} else if (document.querySelector('body.shop-page')) {
					this.getProducts()

				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let container = document.querySelector('div.single-product');
		let title = container.querySelector('h1.product_title').innerText;
		let banner;
		let images = [];
		container.querySelectorAll('.woo-variation-gallery-thumbnail-wrapper .woo-variation-gallery-thumbnail-slider .wvg-gallery-thumbnail-image').forEach(function (v,) {
			let imgUrl = v.querySelector('img').getAttribute('src');
			imgUrl = imgUrl.replace('-100x100', "");
			images.push(imgUrl);
		});
		console.log(images);
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
			market: "WooThemeCanvas"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll('div.products div.product').forEach((el) => {
				let title = el.querySelector("h2.woocommerce-loop-product__title").textContent.trim();
				if (el.querySelector("img.attachment-woocommerce_thumbnail")) {
					let banner = el.querySelector("img.attachment-woocommerce_thumbnail").getAttribute('src');
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector("a.woocommerce-loop-product__link").getAttribute("href");
						pId = new URL(pId);
						pId = pId.pathname;
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							images: [],
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "WooThemeCanvas"
						};
						products.push(product);
					}
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
