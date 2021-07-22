let Teeshirtpalace = class {
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
				if (document.querySelector('body.product-detail-index')) {
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.querySelector('body.listing-index')) {
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
		let container = document.querySelector('.product-info-box');
		let title = container.querySelector('h1.product-info-box__product-name').innerText;
		let banner;
		let images = [];
		container.querySelectorAll('.product-info-box__gallery .owl-dots button').forEach(function (v,) {
			let imgUrl = v.style.backgroundImage.slice(4, -1).replace(/"/g, "");
			imgUrl = new URL(imgUrl);
			imgUrl = imgUrl.origin+imgUrl.pathname;
			images.push(imgUrl);
		});
		console.log(images)
		banner = images.shift();
		banner = container.querySelector('#frontImage').getAttribute('src');
		banner = new URL(banner);
		banner = banner.origin+banner.pathname;
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
			market: "teeshirtpalace"
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
		document.querySelectorAll('.listing-page .listing-page-product-card').forEach((el) => {
				let title = el.querySelector("a.listing-page-product-card__title h6").textContent.trim();
				if (el.querySelector("picture img")) {
					let banner = el.querySelector("picture img").getAttribute('src');
					if (isURL(banner) && banner != null) {
						banner = new URL(banner);
						banner = banner.origin+banner.pathname;
						let pId = el.querySelector("a.product-box__img-box").getAttribute("href");
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							images: [],
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "Teeshirtpalace"
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
