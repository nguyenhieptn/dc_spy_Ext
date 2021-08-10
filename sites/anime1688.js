let Anime1688 = class extends Initial {
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build()
		this.init();
	}

	init()
	{
		let button = document.querySelector('button.exp-btn-push')
		button.addEventListener("click", (e) => {
			e.preventDefault();
			button.classList.add("is-loading");
			if (document.querySelector('html.product-page')) {
				this.getProduct()
			} else if (document.querySelector('html.category-page') || document.querySelector('html.search-page')) {
				this.getProducts()
			}
		});
	}

	getProduct() {
		let title = document.querySelector("h1.heading-title").innerText;
		let banner = null;
		let images = [];
		document.querySelectorAll('#tab-description p img').forEach(function (el) {
			images.push(el.getAttribute('src'));
		})
		banner = images.shift();
		let pId = null;
		pId = window.location.pathname;
		if (!pId) return;
		let tags = [];
		if (document.querySelector('p.tags')) {
			document.querySelectorAll('p.tags a').forEach(function (el) {
				tags.push(el.textContent);
			})
		}
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: location.host
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll('div.main-products > div:not(.ias-noneleft)').forEach((el) => {
				let title = el.querySelector("h4.name a").innerText;
				let banner = el.querySelector(".product-thumb div.image a img").getAttribute("src");
				console.log(banner);
				if (isURL(banner) && banner != null) {
					if (banner.indexOf('/cache')) {
						banner = banner.replace('/cache', '');
					}
					if (banner.indexOf('-228x228')) {
						banner = banner.replace('-228x228', '');
					}
					let pId = el.querySelector("h4.name a").getAttribute("href");
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
						market: location.host
					};
					products.push(product);
				}

			}
		);
		console.log(products);
		this.push(products);
	}
};
