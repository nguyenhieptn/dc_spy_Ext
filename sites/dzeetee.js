let Dzeetee = class {
	constructor() {
		this.domain = location.origin;
		this.init();
	}

	init() {
		let template = document.createElement("div");
		template.classList.add("exp-template");
		let input = document.createElement("input");
		input.name = "campaign_id";
		input.placeholder = "Campaign ID";
		input.classList.add("exp-input");
		template.appendChild(input);
		let select = document.createElement("select");
		select.name = "product_type";
		select.classList.add("exp-select");
		let option = document.createElement("option");
		option.value = "";
		option.innerText = "Select Type";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "mug";
		option.innerText = "Mug";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "shirt";
		option.innerText = "Shirt";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "quilt";
		option.innerText = "Quilt";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "shirt3d";
		option.innerText = "3D Shirt";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "mask";
		option.innerText = "Mask";
		select.appendChild(option);
		option = option.cloneNode();
		option.value = "other";
		option.innerText = "Other";
		select.appendChild(option);
		template.appendChild(select);
		let button = document.createElement("button");
		button.classList.add("exp-btn");
		button.innerText = "Push Data";
		template.appendChild(button);
		document.body.appendChild(template);
		let that = this;
		window.onload = function () {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.getElementsByClassName('TagPage').length > 0 || document.getElementsByClassName('SearchPage').length > 0) {
					that.getProducts((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.getElementsByClassName('CampaignPage').length > 0) {
					that.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				}
			})
		}
	}

	getProducts(cb) {
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id.length === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
		if (type.length === 0) {
			expToast("error", "Please select type!");
			return;
		}
		let listProducts = document.getElementsByClassName('RetailProductList')[0];
		if (listProducts === undefined || listProducts === null) {
			expToast("error", "Can't push product in this page!");
			return;
		}
		let product_nodes = listProducts.querySelectorAll('a:not(.overflow-hidden):not(.cursor-pointer)');
		let productsA = Array.from(product_nodes);
		if (productsA.length <= 0) {
			expToast("error", "Can't push product in this page!");
			return;
		}
		let products = [];
		for (let i = 0; i < productsA.length; i++) {
			let product_id = productsA[i].getAttribute('href');
			let product = productsA[i].querySelector('.p-relative');
			let img = product.querySelector('img');
			let title = img.getAttribute('alt');
			let banner = img.getAttribute('src');
			if (banner.indexOf('medium.jpg')) {
				banner = banner.replace('medium.jpg', 'regular.jpg');
			}
			products.push({
				type: type,
				title: title,
				banner: banner,
				images: [],
				item_id: product_id,
				tags: [],
				store: location.host,
				market: location.host
			})
		}
		this.pushProduct(cb, campaign_id, products);
	}

	getProduct(cb) {
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id.length === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
		if (type.length === 0) {
			expToast("error", "Please select type!");
			return;
		}
		let productContainer = document.querySelector('.ProductImageShowcase');
		if(productContainer === undefined)
		{
			expToast("error", "Can't push product in this page!");
			return;
		}
		let product_id = location.pathname+location.search;
		let banner = productContainer.querySelector('img').getAttribute('src');
		let title = productContainer.querySelector('img').getAttribute('alt')
		let product = {
			type: type,
			title: title,
			banner: banner,
			images: [],
			item_id: product_id,
			tags: [],
			store: location.host,
			market: location.host
		}
		this.pushProduct(cb, campaign_id, [product]);
	}

	pushProduct(callback, campaign_id, products) {
		if (products.length == 0) {
			expToast("error", "No more product!");
			return;
		} else {
			chrome.runtime.sendMessage({
				action: 'xhttp',
				method: 'POST',
				url: DataCenter + "/api/campaigns/products",
				headers: {
					token: token
				},
				data: JSON.stringify({
					products: products,
					campaign_id: campaign_id
				})
			}, function (responseText) {
				let data = JSON.parse(responseText);
				callback(data);
			});
		}
	}
}