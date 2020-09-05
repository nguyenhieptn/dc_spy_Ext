let StoreFront = class {
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
				if (document.querySelector('.campaigns-container')) {
					button.classList.add("is-loading");
					that.getProducts((data) => {
						button.classList.remove("is-loading");
						console.log()
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				}
				else if(document.querySelector('.buy-page'))
				{
					button.classList.add("is-loading");
					that.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				}
				else
					expToast("error", "Cant crawl this page!");
			})
		}
	}
	getProduct(cb){
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
		let banner = document.getElementById('productImageId').getAttribute('src');
		let title = document.querySelector('h1.campaign-name-title').textContent;
		let item_id = location.pathname;
		let product= {
			type: type,
			images: [],
			tags: [],
			item_id: item_id,
			title: title,
			banner: banner,
			store: location.host,
			market: location.host
		}
		this.pushProduct(cb, campaign_id, [product]);
	}
	getProducts(callback) {
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
		let products = [];
		let productContainer = document.querySelector('.campaigns-container');
		if (productContainer == null) expToast("error", "Cant crawl this page!");
		let productItems = productContainer.querySelectorAll('div[ng-repeat="item in row"]');
		productItems = Array.from(productItems);
		productItems.forEach(function (el) {
			let bannerContainer = el.querySelector('.img-container');
			let banner = bannerContainer.querySelector('img').getAttribute('src');
			if (banner.charAt(banner.length - 1) !== "L") {
				banner = banner.substring(0, banner.length - 1) + 'L';
			}
			let title = bannerContainer.querySelector('img').getAttribute('alt');
			let item_id = bannerContainer.querySelector('a').getAttribute('href');
			products.push({
				type: type,
				images: [],
				tags: [],
				item_id: item_id,
				title: title,
				banner: banner,
				store: location.host,
				market: location.host
			})
		})
		if (products.length > 0) {
			this.pushProduct(callback, campaign_id, products);
		} else
			expToast("error", "No more product!");
	}

	pushProduct(callback, campaign_id, products) {
		if (products.length === 0) {
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
