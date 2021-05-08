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
				if (document.getElementsByClassName('TagPage').length > 0 || document.getElementsByClassName('SearchPage').length > 0 || document.querySelector('.RetailProductList') !== null) {
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
				type: "",
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
		let productContent = document.querySelector('.ProductDetails');
		let productContainer = document.querySelector('.ProductImageShowcase');
		if (productContainer === undefined || productContent === undefined) {
			expToast("error", "Can't push product in this page!");
			return;
		}
		let product_id = location.pathname;
		let banner;
		let title = productContainer.querySelector('img').getAttribute('alt');
		let images = [];
		document.querySelectorAll('#contentThumb .ProductTile').forEach(function (el) {
			let img = el.querySelector('img').getAttribute('src');
			if(img.indexOf('/thumb') !== -1)
			{
				img = img.replace('/thumb', '/regular' );
			}
			images.push(img);
		});
		if(images.length > 0)
		{
			banner = images.shift();
		}
		else
			banner = productContainer.querySelector('img').getAttribute('src');
		let variationColor = productContent.getElementsByClassName('color-tiles-container')[0];
		let tags = [];
		productContent.querySelectorAll('a[href^="/tags/"]').forEach(function (el) {
			tags.push(el.textContent);
		});
		let product = {
			type: null,
			title: title,
			banner: banner,
			images: images,
			item_id: product_id,
			tags: tags,
			store: location.host,
			market: location.host
		}
		if (variationColor !== undefined) {
			let colorButtons = variationColor.querySelectorAll(':scope > div');
			colorButtons = Array.from(colorButtons);
			colorButtons.shift();
			return this.getImages(colorButtons, cb, campaign_id, product);
		} else
			this.pushProduct(cb, campaign_id, [product]);
	}

	getImages(buttons, cb, campaign_id, product, reClick = false) {
		if (!reClick) {
			buttons[0].querySelector("div.cursor-pointer").click();
			buttons.shift();
		}
		let that = this;
		setTimeout(function () {
			let productContainer = document.querySelector('.ProductImageShowcase');
			let image = productContainer.querySelector('img').getAttribute('src');
			if (product.images[product.images.length - 1] === image) {
				return that.getImages(buttons, cb, campaign_id, product, true);
			} else {
				if (buttons.length > 0) {
					product.images.push(image);
					return that.getImages(buttons, cb, campaign_id, product);
				} else {
					product.images.push(image);
					let productContent = document.querySelector('.ProductDetails');
					let variationColor = productContent.getElementsByClassName('color-tiles-container')[0];
					if (variationColor !== undefined) {
						let colorButtons = variationColor.querySelectorAll(':scope > div');
						colorButtons = Array.from(colorButtons);
						colorButtons[0].querySelector("div.cursor-pointer").click();
					}
					return that.pushProduct(cb, campaign_id, [product])
				}
			}
		}, 500);
	}

	pushProduct(callback, campaign_id, products) {
		console.log(products);
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