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
		template.appendChild(select);
		let button = document.createElement("button");
		button.classList.add("exp-btn");
		button.innerText = "Push Data";
		template.appendChild(button);
		option = option.cloneNode();
		option.value = "other";
		option.innerText = "Other";
		select.appendChild(option);
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
			} else if (location.href.indexOf("https://www.ebay.com/sch") !== -1) {
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
		let keyword = document.querySelector("input[name=\"_odkw\"]").value;
		let products = [];
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
		document.querySelectorAll("[class*=\"item__wrapper\"]").forEach((el) => {
			let title = el.querySelector("h3[class*=\"item__title\"]").innerText;
			let elm = el.querySelector("img[class*=\"item__image-img\"]");
			let banner = elm.getAttribute("src");
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
			tags.push(keyword);
			let store = "";
			let type = "";
			if (banner.indexOf("mug")) type = "mug";
			let product = {
				type: type,
				title: title,
				banner: banner,
				item_id: pId,
				tags: tags,
				store: store,
				market: "ebay"
			};
			products.push(product);
		});
		if(products.length === 0)
		{
			if(document.getElementById('ResultSetItems') !== null)
			{
				let listItems = document.getElementById('ResultSetItems')
					.querySelector('ul').children;
				for(let i =0; i<listItems.length; i++)
				{
					if(listItems[i].tagName !== 'LI') continue;
					let title = listItems[i].querySelector('h3 a').getAttribute('title');
					title = title.replace('Click this link to access ',"");
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
						type: type,
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

		if(products.length == 0) expToast("error", "Cant crawl this page!");
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
		let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
		if (type.length === 0) {
			expToast("error", "Please select type!");
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
			type: type,
			title: title,
			banner: banner,
			images: images,
			item_id: pId,
			store: store,
			market: "ebay"
		};
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