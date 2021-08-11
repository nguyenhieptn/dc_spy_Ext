let Fanatics = class extends Initial {
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build();
		this.init();
	}

	init() {
		let button = document.querySelector('button.exp-btn-push');
		button.addEventListener("click", (e) => {
			e.preventDefault();
			button.classList.add("is-loading");
			if (document.querySelector('.hammer-container ')) {
				this.getProduct();
			} else if (document.querySelector('.product-grid')) {
				this.getProducts();
			}
			else
				expToast("error", "Cant crawl this page!");
		});
	}

	getProduct() {
		let title = document.querySelector(".product-title-container h1").innerText;
		let banner = null;
		let images = [];
		document.querySelectorAll('.image-container .hammer-container img').forEach(function (el) {
			let img = el.getAttribute('src');
			img = "https:"+img.replace('w=900', "w=1000");
			images.push(img)
		})
		banner = images.shift();
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
			market: "fanatics"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
			document.querySelectorAll('.product-grid .product-card').forEach((el) => {
					let title = el.querySelector("div.product-card-title a").textContent;
					let banner = el.querySelector("div.product-image-container a img").getAttribute("src");
					banner = "https:" + banner;
					banner = banner.replace("w=340", "w=1000");
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector(".product-card-title a").getAttribute("href");
						pId = new URL(location.origin + pId);
						pId = pId.pathname;
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "fanatics"
						};
						products.push(product);
					}

				}
			);
		console.log(products);
		this.push(products);
	}
};
