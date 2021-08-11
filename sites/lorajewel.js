let Lorajewel = class extends Initial{
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
				if (document.querySelector('.product-detail')) {
					this.getProduct()
				} else if (document.querySelector('.collection__container')) {
					this.getProducts()
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector("h1.product-info__header_title").innerText;
		let images = [];
		document.querySelectorAll("div.product-image__thumbs-content img.lazyloaded").forEach(function (v, k) {
			let imgUrl = v.getAttribute('src');
			imgUrl = imgUrl.replace('_100x', "");
			images.push("https:"+imgUrl);
		});
		let banner = images.shift();
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let pId = null;
		pId = location.origin + location.pathname;
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
			market: "lorajewel"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll(".collection__container .collection-product__wrapper div.common__product-gap").forEach((el) => {
				let title = el.querySelector("a.product-snippet__title-normal").innerText;
				if (el.querySelector(".product-snippet__img-wrapper img")) {
					let banner = el.querySelector(".product-snippet__img-wrapper img").getAttribute("srcset");
					if(banner === null) expToast('error', "Scroll up|down until all product images loaded!");
					banner = banner.split(',')[0];
					banner = banner.substr(0, banner.indexOf(" "));
					banner = banner.replace('_360x', "");
					banner = 'https:' + banner;
					let pId = new URL(location.origin + el.querySelector("a.product-snippet__title-normal").getAttribute("href"));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.href,
						tags: tags,
						store: location.host,
						market: "lorajewel"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
