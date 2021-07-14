let Zavvi = class {
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
				if (document.querySelector('body.product')) {
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.querySelector('body.list') || document.querySelector('body.searchlist')) {
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
		let container = document.querySelector('.tokyoProductPage');
		let title = container.querySelector('h1.productName_title').innerText;
		let banner;
		let images = [];
		document.querySelectorAll('.productImageCarousel ul li').forEach(function (v,) {
			let imgUrl = v.querySelector('img').getAttribute('src');
			if (imgUrl.indexOf('130/130')) {
				imgUrl = imgUrl.replace('130/130', '1600/1600');
			}
			imgUrl = imgUrl.replace('xsmall', 'large');
			imgUrl = imgUrl.replace('small', 'large');
			images.push(imgUrl);
		});
		banner = images.shift();
		let pId = null;
		pId = location.pathname + location.search;
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
			market: "Zavvi"
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
		document.querySelectorAll('ul.productListProducts_products li').forEach((el) => {
				let title = el.querySelector("h3.productBlock_productName").textContent;
				if (el.querySelector("img.productBlock_image")) {
					let banner = el.querySelector(".productBlock_imageContainer img").getAttribute('src');
					banner = banner.replace('xsmall', 'large');
					let altImage = el.querySelector(".productBlock_imageContainer img").getAttribute('data-alt-src');
					altImage = altImage.replace('xsmall', 'large');
					let images = [altImage];
					if (isURL(banner) && banner != null) {
						let pId = el.querySelector("a.productBlock_link").getAttribute("href");
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							images: images,
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "Zavvi"
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
