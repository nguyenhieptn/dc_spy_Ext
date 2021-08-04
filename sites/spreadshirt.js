let Spreadshirt = class {
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
				if (document.querySelector("#article-detail-page")) {
					console.log('dvh');
					this.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else if (document.querySelector('#article-list-page')) {
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
		let title = document.querySelector("h1.pdp-header__design-title").innerText;
		let images = [];
		document.querySelectorAll("ul.pdp-thumbnails__list li").forEach(function (v, k) {
			let imgUrl = v.querySelector('img').getAttribute('src');
			imgUrl = imgUrl.replace('width=120,height=120', "width=1200,height=1200");
			images.push("http:"+imgUrl);
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
		if (elm) {
			let tagcontainer = null;
			document.querySelectorAll('ul.elementor-post-info li').forEach(function (v, k) {
				if (v.querySelector('span.elementor-post-info__item-prefix').textContent === "Tags") {
					tagcontainer = v;
				}
			})
			if (tagcontainer) {
				console.log(tagcontainer);
				tagcontainer = tagcontainer.querySelector('span.elementor-post-info__terms-list')
				if (tagcontainer) {
					tagcontainer.querySelectorAll('a').forEach(function (v, k) {
						tags.push(v.textContent);
					})
				}
			}
		}
		console.log(images, banner);
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "spreadshirt"
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
		document.querySelectorAll("#articleTileList .article").forEach((el) => {
				let title = el.querySelector(".article__name").innerText;
				if (el.querySelector(".article__img")) {
					let banner = el.querySelector(".article__img").getAttribute("src");
					banner = banner.replace('width=378,height=378', "width=1200,height=1200");
					banner = 'https:' + banner;
					let pId = new URL('https:' + el.getAttribute("href"));
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId.href,
						tags: tags,
						store: location.host,
						market: "spreadshirt"
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
