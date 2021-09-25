let Cafepress = class extends Initial{
	constructor() {
		super();
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
				if (document.querySelector('#product-details')) {
					this.getProduct()
				}else if(document.querySelector('#listingGroup'))
				{
					this.getProducts()
				}
				else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let container = document.querySelector('#product-details');
		let title = container.querySelector('.h1 .productName').innerText;
		let banner = container.querySelector('#mainImage0').getAttribute('data-zoom');
    console.log(banner);
    let images = [];
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
			market: "cafepress"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll('#listingGroup .listing-item').forEach((el) => {
				let title = el.querySelector(".listing-image").getAttribute('title').trim();
				if (el.querySelector(".listing-image")) {
					let banner = el.querySelector(".listing-image").getAttribute('data-alt-src');
            banner = banner.replace('300x300', "1000x1000");
						let pId = el.getAttribute("href");
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "cafepress"
						};
						products.push(product);
					}
				}
		);
    console.log(products);
		this.push(products);
	}
};
