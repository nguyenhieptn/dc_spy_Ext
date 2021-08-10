let Codeigniter = class extends Initial{
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
				if (document.querySelector('#product-add-to-cart')) {
					this.getProduct()
				}else if(location.pathname.indexOf('/search/') !== -1)
				{
					this.getProducts()

				}
				else
					expToast("error", 'Cant crawl this page!');
			});
	}

	getProduct() {
		let title = document.querySelector('#product_title').value;
		let banner;
		let images = [];
		document.querySelectorAll('ul.product__list li').forEach(function(v, ){
			let imageUrl = v.querySelector('img').getAttribute('data-src');
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
			market: "Codeigniter"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll('section.product_block__section div.product_card').forEach((el) => {
				let title = el.querySelector("div.product_card__title").textContent;
				if (el.querySelector("div.product_card__image")) {
					let banner = el.querySelector("div.product_card__image").style.backgroundImage.slice(4, -1).replace(/"/g, "");
					console.log(banner);
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector("a.js-card").getAttribute("href");
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
							market: "Codeigniter"
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
