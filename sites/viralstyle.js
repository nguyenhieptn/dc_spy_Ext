let Viralstyle = class extends Initial{
	constructor() {
		super();
		this.domain = location.origin;
		this.build();
		this.init();
	}

	init() {
		let button = document.querySelector('button.exp-btn-push')
		let that = this;
		window.onload = function () {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				that.getProducts();
			})
		}
	}

	getProducts(callback) {
		let el_products = document.querySelectorAll('.container a.mp-campaign');
		el_products = Array.from(el_products);
		let products = [];
		el_products.forEach(function (el) {
			let banner = el.querySelector('img').getAttribute('data-src');
			let container = el.querySelector('div');
			let title = container.querySelector('div').textContent;
			console.log(title);
			if(banner.indexOf('medium') !== -1)
			{
				banner = banner.replace('medium', 'large');
			}
			let product = {
				type: type,
				images: [],
				tags: [],
				item_id: el.getAttribute('href'),
				title: title,
				banner: banner,
				store: location.host,
				market: location.host
			}
			products.push(product);
		});
		if(products.length > 0)
		{
			this.pushProduct(products);
		}
		else
			expToast("error", "No more product!");
	}

	pushProduct(products) {
		if (products.length === 0) {
			expToast("error", "No more product!");
			return;
		} else {
			this.push(products);
		}
	}

}
