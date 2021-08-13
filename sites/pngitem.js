let Pngitem = class extends Initial {
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
			if (document.querySelector('div.detail-page')) {
				this.getProduct();
			} else if (document.querySelector('#main-wrapper-searchresult')) {
					this.getProducts()
			} else
				expToast("error", 'Cant crawl this page!');
		});
	}

	getProduct() {
		let container = document.querySelector('div.centered-details');
		let title = container.querySelector('#imageTitleText').innerText.trim();
		let banner;
		let images = [];
		banner = document.querySelector('#compImg').getAttribute('src');
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
			market: "pngitem"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll("div.search_results div.item a").forEach((el) => {
				if (el.querySelector('img')) {
					let title = el.querySelector('img').getAttribute('alt');
					let banner = el.querySelector('img').getAttribute("data-original");
					let pId =  el.getAttribute('data-url');
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId,
						tags: tags,
						store: location.host,
						market: "pngitem"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
