let Lorajewel = class {
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
				if (document.querySelector('.product-detail')) {
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.querySelector('.collection__container')) {
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
		let title = document.querySelector("h1.product-info__header_title").innerText;
		let images = [];
		document.querySelectorAll("div.product-image__thumbs-content img.lazyloaded").forEach(function (v, k) {
			let imgUrl = v.getAttribute('src');
			imgUrl = imgUrl.replace('_100x', "");
			images.push("https:"+imgUrl);
		});
		let banner = images.shift();
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let pId = null;
		pId = location.origin + location.pathname;
		if (!pId) return;
		let elm = document.querySelector("ul.elementor-post-info");
		let tags = [];
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "lorajewel"
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
		document.querySelectorAll(".collection__container .collection-product__wrapper div.common__product-gap").forEach((el) => {
				let title = el.querySelector("a.product-snippet__title-normal").innerText;
				if (el.querySelector(".product-snippet__img-wrapper img")) {
					let banner = el.querySelector(".product-snippet__img-wrapper img").getAttribute("srcset");
					if(banner === null) expToast('error', "Scroll up|down until all product images loaded!");
					banner = banner.split(',')[0];
					banner = banner.substr(0, banner.indexOf(" "));
					banner = banner.replace('_360x', "");
					banner = 'https:' + banner;
					let pId = new URL(location.origin + el.querySelector("a.product-snippet__title-normal").getAttribute("href"));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.href,
						tags: tags,
						store: location.host,
						market: "lorajewel"
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
