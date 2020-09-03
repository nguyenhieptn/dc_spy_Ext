let Viralstyle = class {
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
				that.getProducts((data) => {
					button.classList.remove("is-loading");
					console.log()
					if (data.status === "succeed") {
						expToast("success", "Push Successfully!");
					} else {
						expToast("error", data.msg);
					}
				})
			})
		}
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
			this.pushProduct(callback, campaign_id, products);
		}
		else
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
