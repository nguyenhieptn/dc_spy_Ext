let mhempearth = class {
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
				if (document.querySelector('#productinfoBody')) {
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				}else if(document.querySelector('#indexBody'))
				{
					this.getProducts((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})

				}
				else
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
		let container = document.querySelector('.productDetail-product ');
		let title = document.querySelector('h1.productDetail-tileName').textContent.trim();
		let banner;
		let images = [];
		document.querySelectorAll('#slide li').forEach(function(v, ){
			let imageUrl = v.querySelector('img').getAttribute('src');
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
			market: "mhempearth"
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
		document.querySelectorAll('#Collection .producttile-list .product-item').forEach((el) => {
				let title = el.querySelector("a.product-item-link span").textContent;
				if (el.querySelector(".product-image img")) {
					let banner = el.querySelector(".product-image img").getAttribute('src');
					console.log(banner);
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector("a.product-item-link").getAttribute("href");
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
							market: "mhempearth"
						};
						products.push(product);
					}
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
