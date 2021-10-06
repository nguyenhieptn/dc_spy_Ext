let Spreadshirt = class extends Initial{
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
				if (document.querySelector("#article-detail-page")) {
					console.log('dvh');
					this.getProduct()
				} else if (document.querySelector('#article-list-page')) {
					this.getProducts()
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector("h1.pdp-header__design-title").innerText;
		let images = [];
		document.querySelectorAll("ul.pdp-thumbnails__list li").forEach(function (v, k) {
			let imgUrl = v.querySelector('img').getAttribute('src');
			imgUrl = imgUrl.replace('width=120,height=120', "width=1200,height=1200");
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
		if (elm) {
			let tagcontainer = null;
			document.querySelectorAll('ul.elementor-post-info li').forEach(function (v, k) {
				if (v.querySelector('span.elementor-post-info__item-prefix').textContent === "Tags") {
					tagcontainer = v;
				}
			})
			if (tagcontainer) {
				console.log(tagcontainer);
				tagcontainer = tagcontainer.querySelector('span.elementor-post-info__terms-list')
				if (tagcontainer) {
					tagcontainer.querySelectorAll('a').forEach(function (v, k) {
						tags.push(v.textContent);
					})
				}
			}
		}
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "spreadshirt"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll("#articleTileList .article").forEach((el) => {
				let title = el.querySelector(".article__name").innerText;
				if (el.querySelector(".article__img")) {
					let banner = el.querySelector(".article__img").getAttribute("src");
					banner = banner.replace('width=378,height=378', "width=1200,height=1200");
					banner = 'https:' + banner;
					let pId = new URL('https:' + el.getAttribute("href"));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.href,
						tags: tags,
						store: location.host,
						market: "spreadshirt"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
