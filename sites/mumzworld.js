let Mumzworld = class extends Initial {
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
			if (document.querySelector('body.catalog-product-view ')) {
				this.getProduct()
			} else
				expToast("error", 'Cant crawl this page!');
		});
	}

	getProduct() {
		let container = document.querySelector('.product-view');
		let title = container.querySelector('.product-name h1').innerText;
		let banner;
		let images = [];
		banner = document.querySelector('p.product-image #wrap a').getAttribute('href');
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
			market: "munzworld"
		};
		console.log(product);
		this.push([product]);
	}
};
