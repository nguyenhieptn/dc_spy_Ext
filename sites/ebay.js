let Ebay = class {
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
		button.addEventListener("click", (e) => {
			e.preventDefault();
			button.classList.add("is-loading");
			if (location.href.indexOf("https://www.ebay.com/itm/") !== -1) {
				that.getProduct((data) => {
					button.classList.remove("is-loading");
					if (data.status === "succeed") {
						expToast("success", "Push Successfully!");
					} else {
						expToast("error", data.msg);
					}
				})
			} else if (location.href.indexOf("https://www.ebay.com/sch") !== -1 || location.href.indexOf("https://www.ebay.com/str") !== -1) {
				that.getProducts((data) => {
					button.classList.remove("is-loading");
					if (data.status === "succeed") {
						expToast("success", "Push Successfully!");
					} else {
						expToast("error", data.msg);
					}
				});
			}
		});
	}

	getProducts(callback) {
		let keyword = null
		if (document.querySelector("input[name=\"_odkw\"]")) {
			keyword = document.querySelector("input[name=\"_odkw\"]").value;
		}
		let products = [];
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id.length === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		document.querySelectorAll("[class*=\"item__wrapper\"]").forEach((el) => {
			let title = el.querySelector("h3[class*=\"item__title\"]").innerText;
			let elm = el.querySelector("img[class*=\"item__image-img\"]");
			let banner = null;
			if (elm)
				banner = elm.getAttribute("src");
			else {
				return;
			}
			if (!isURL(banner)) return;
			banner = banner.substring(0, banner.lastIndexOf("/"));
			banner += "/s-l1600.jpg";
			elm = el.querySelector("[class*=\"item__link\"]");
			let url = elm.getAttribute("href");
			url = url.substring(0, url.indexOf("?"));
			let pId = url.substr(url.lastIndexOf("/") + 1);
			if (pId.length === 0) {
				url = url.substring(0, url.lastIndexOf("/"));
				pId = url.substr(url.lastIndexOf("/") + 1);
			}
			let tags = [];
			if (keyword)
				tags.push(keyword);
			let store = "";
			let type = "";
			let product = {
				type: type,
				title: title,
				banner: banner,
				item_id: pId,
				tags: tags,
				store: 'ebay',
				market: "ebay"
			};
			products.push(product);
		});
		if (products.length === 0) {
			if (document.getElementById('ResultSetItems') !== null) {
				let listItems = document.getElementById('ResultSetItems')
					.querySelector('ul').children;
				for (let i = 0; i < listItems.length; i++) {
					if (listItems[i].tagName !== 'LI') continue;
					let title = listItems[i].querySelector('h3 a').getAttribute('title');
					title = title.replace('Click this link to access ', "");
					let banner = listItems[i].querySelector('div.img a img').getAttribute('src');
					if (!isURL(banner)) continue;
					banner = banner.substring(0, banner.lastIndexOf("/"));
					banner += "/s-l1000.jpg";
					let url = listItems[i].querySelector('h3 a').getAttribute("href");
					url = url.substring(0, url.indexOf("?"));
					let pId = url.substr(url.lastIndexOf("/") + 1);
					if (pId.length === 0) {
						url = url.substring(0, url.lastIndexOf("/"));
						pId = url.substr(url.lastIndexOf("/") + 1);
					}
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId,
						tags: [],
						store: "ebay",
						market: "ebay"
					};
					products.push(product);
				}
			}
		}

		if (products.length == 0) expToast("error", "Cant crawl this page!");
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

	getProduct(callback) {
		let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
		if (campaign_id.length === 0) {
			expToast("error", "Please input campaign ID!");
			return;
		}
		let title = document.getElementById("vi-lkhdr-itmTitl").textContent;
		let store = document.querySelector("a[href^=\"https://www.ebay.com/usr/\"] span").textContent;
		let pathname = location.pathname;
		let pId = pathname.substr(pathname.lastIndexOf("/") + 1);
		if (pId.length === 0) {
			pathname = pathname.substring(0, pathname.lastIndexOf("/"));
			pId = pathname.substr(pathname.lastIndexOf("/") + 1);
		}

		let banner = document.getElementById('icImg').getAttribute('src');
		banner = banner.substring(0, banner.lastIndexOf("/"));
		banner += "/s-l1000.jpg";
		let images = [];
		document.querySelectorAll("#vi_main_img_fs td.tdThumb img[src]").forEach(function (el) {
			let url = el.getAttribute("src");
			if (isURL(url)) {
				url = url.substring(0, url.lastIndexOf("/"));
				url += "/s-l1600.jpg";
				images.push(url);
			}
		});
		images.shift();
		let product = {
			type: "",
			title: title,
			banner: banner,
			images: images,
			item_id: pId,
			store: "ebay",
			market: "ebay"
		};
		console.log(product);
		chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'POST',
			url: DataCenter + "/api/campaigns/product",
			headers: {
				token: token
			},
			data: JSON.stringify({
				product: product,
				campaign_id: campaign_id
			})
		}, function (responseText) {
			let data = JSON.parse(responseText);
			callback(data);
		});
	}
};
