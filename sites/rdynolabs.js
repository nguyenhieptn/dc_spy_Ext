let Rdynolabs = class {
	constructor() {
		this.domain = location.origin;
		this.href = location.href;
		this.init();
	}

	init() {
		if (document.querySelector('.exp-template') === null) {
			let template = document.createElement("div");
			template.classList.add("exp-template");
			let input = document.createElement("input");
			input.name = "campaign_id";
			input.placeholder = "Campaign ID";
			input.classList.add("exp-input");
			template.appendChild(input);
			let button = document.createElement("button");
			button.classList.add("exp-btn");
			button.innerText = "Push Data";
			template.appendChild(button);
			document.body.appendChild(template);
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.querySelector('div.productDetail-productSection')) {
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.querySelector('#Collection')) {
					this.getProducts((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct(callback) {
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id.length === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		let title = document.querySelector("h1.productDetail-tileName").innerText;
		let images = [];
		let banner;
		if(document.querySelectorAll('ul#slide li').length >0)
		{
			document.querySelectorAll('ul#slide li a img').forEach(function (v, k) {
				let imgUrl = v.getAttribute('src');
				images.push(imgUrl);
			});
			banner = images.pop();
		}
		else
		{
			banner = document.querySelector('div.picZoomer-pic-wp img').getAttribute('src');
		}
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
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
			market: "rdynolabs"
		};
		console.log(product);
		chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'POST',
			url: DataCenter + "/api/campaigns/products",
			headers: {
				token: token
			},
			data: JSON.stringify({
				products: [product],
				campaign_id: campaign_id
			})
		}, function (responseText) {
			let data = JSON.parse(responseText);
			callback(data);
		});
	}

	getProducts(callback) {
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id === "" || campaign_id === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		let products = [];
		document.querySelectorAll("#Collection .producttile-list .product-item").forEach((el) => {
				let title = el.querySelector(".product-item-link span").textContent;
				if (el.querySelector("a.product-item-photo img.photo")) {
					let banner = el.querySelector("a.product-item-photo img.photo").getAttribute("src");
					let pId = new URL(el.querySelector("a.product-item-link ").getAttribute('href'));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.pathname,
						tags: tags,
						store: location.host,
						market: "rdynolabs"
					};
					products.push(product);
				}
			}
		);
		console.log(products);
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
};
