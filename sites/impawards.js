let Impawards = class {
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
				let pathname = location.pathname.split('/');
				let isArchivePage = false;
				for (let i = 0; i < pathname.length; i++) {
					if (pathname[i] === "std.html" || pathname[i] === "index.html") {
						isArchivePage = true
					}
				}
				if (isArchivePage) {
					that.getProducts((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					});
				} else if (document.getElementsByClassName('rightsidesmallbordered').length > 0) {
					that.getProduct((data) => {
						button.classList.remove("is-loading");
						if (data.status === "succeed") {
							expToast("success", "Push Successfully!");
						} else {
							expToast("error", data.msg);
						}
					})
				} else {
					expToast("error", "Cant push product!");
				}
			})
		}
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
		let productContainer = document.getElementsByClassName('rightsidesmallbordered')[0].closest('.container').querySelector('.row');
		let locationBaseName = location.href.replace(/^.*\/|\.[^.]*$/g, '');
		let origin = location.href.slice(location.href.indexOf(locationBaseName), location.href.length);
		origin = location.href.replace(origin, '');
		let banner = productContainer.querySelector('.col-sm-6:first-child p[class="small"] a img').getAttribute('src');
		let bannerPath = banner.split('/')[0];
		let bannerBaseName = banner.replace(/^.*\/|\.[^.]*$/g, '');
		let bannerExtension = banner.split('.').pop();
		let hrefBanner = productContainer.querySelectorAll('.col-sm-6:first-child p[class="small"] a');
		for (let i = 0; i < hrefBanner.length; i++) {
			let otherSize = hrefBanner[i].getAttribute('href');
			if (otherSize.indexOf('_xxlg') !== -1) {
				if (bannerBaseName.indexOf('_xlg') !== -1)
					bannerBaseName = bannerBaseName.replace('_xlg', '');
				bannerBaseName = bannerBaseName + '_xxlg';
				break;
			}
			if (otherSize.indexOf(!('_xlg' === -1)) && bannerBaseName.indexOf('_xlg') === -1) {
				bannerBaseName = bannerBaseName + '_xlg';
			}
		}
		banner = [bannerPath, bannerBaseName + '.' + bannerExtension].join('/');
		banner = origin + banner;
		let pId;
		pId = location.pathname;
		let title = productContainer.querySelector('.col-sm-6:last-child h3').textContent;
		let images = [];
		let product = {
			type: type,
			title: title,
			banner: banner,
			images: images,
			item_id: pId,
			tags: [],
			store: location.host,
			market: 'impawards',
		};
		let altDesign = productContainer.querySelector('.col-sm-6:first-child div[id="altdesigns"]')
		if (altDesign != null) {
			let designs = altDesign.querySelectorAll('a');
			designs = Array.from(designs);
			this._getProduct(callback, campaign_id, product, designs, origin);
		} else
			this.pushProduct(callback, campaign_id, [product]);
	}

	_getProduct(callback, campaign_id, product, designs, origin) {
		let design = designs[0].querySelector('img').getAttribute('src');
		designs.shift();
		if (design.indexOf('thumbs') !== -1) {
			design = design.replace('thumbs', 'posters');
		}
		let patch = design.split('/')[0];
		let baseName = design.replace(/^.*\/|\.[^.]*$/g, '') + '_xxlg';
		if (baseName.indexOf('imp_') !== -1) {
			baseName = baseName.replace('imp_', '');
		}
		let extension = design.split('.').pop();
		let url = [patch, baseName + '.' + extension].join('/');
		//checkUrl
		this.___getProduct(callback, campaign_id, product, designs, origin, url)

	}

	___getProduct(callback, campaign_id, product, designs, origin, url) {
		let request = new XMLHttpRequest();
		let that = this;
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200) {
					product.images.push(origin + url);
					if (designs.length > 0) {
						that._getProduct(callback, campaign_id, product, designs, origin)
					} else
						that.pushProduct(callback, campaign_id, [product]);
				} else if (url.indexOf('_xxlg') !== -1) {
					url = url.replace('_xxlg', '_xlg');
					that.___getProduct(callback, campaign_id, product, designs, origin, url)
				} else if (url.indexOf('_xlg') !== -1) {
					url = url.replace('_xxlg', '');
					product.images.push(origin + url);
					if (designs.length > 0) {
						that._getProduct(callback, campaign_id, product, designs, origin)
					} else
						that.pushProduct(callback, campaign_id, [product]);
				}
			}
		};
		request.open("GET", url, true);
		request.send(null);
	}

	getProducts(callback) {
		expToast("error", "Cant push product this page!");
		return;
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
		let url = window.location;
		let pathName = window.location.pathname.split('/');
		let productUrl, page;
		if (pathName.indexOf('std.html') !== -1) {
			let tableProduct = document.getElementsByTagName('table')[0];
			let trProducts = tableProduct.querySelectorAll('tbody tr');
			let products = [];
			for (let i = 0; i < trProducts.length; i++) {
				let product;
				if (trProducts[i].querySelectorAll('td').length < 2) continue;
				let title = trProducts[i].querySelector('td:first-child font').textContent;
				let productId = trProducts[i].querySelector('td:last-child').querySelector('a:first-child').getAttribute('href');
				let productImages = trProducts[i].querySelectorAll('td:last-child a');
				let images = [];
				let bannerArray = trProducts[i].querySelector('td:last-child a img').getAttribute('src').split('/');
				let banner = '';
				if (bannerArray.indexOf('') === 0) {
					banner = location.origin + '/' + bannerArray.join("/");
				} else {
					let path = location.pathname.split('/');
					path.pop();
					path = path.join("/");
					let bannerUrl = bannerArray.join("/");
					if (bannerUrl.indexOf('thumbs') !== -1) {
						bannerUrl = bannerUrl.replace("thumbs", "posters");
					}
					if (bannerUrl.indexOf('imp_') !== -1) {
						bannerUrl = bannerUrl.replace("imp_", "");
					}
					bannerUrl = bannerUrl.split('/');
					let fileName = bannerUrl[bannerUrl.length - 1].split('.').slice(0, -1).join('.');
					let bannerExtension = bannerUrl[bannerUrl.length - 1].split('.').pop();
					fileName = fileName + '_xxlg';
					bannerUrl.pop();
					bannerUrl.push(fileName);
					bannerUrl = bannerUrl.join('/') + '.' + bannerExtension;
					banner = location.origin + path + '/' + bannerUrl;
					let request = new XMLHttpRequest();
				}
				if (productImages.length > 1) {
					for (let i = 1; i < productImages.length; i++) {
						let path = location.pathname.split('/');
						path.pop();
						path = path.join("/");
						let imgUrl = productImages[i].querySelector('img').getAttribute('src');
						if (imgUrl.indexOf('thumbs') !== -1) {
							imgUrl = imgUrl.replace("thumbs", "posters");
						}
						if (imgUrl.indexOf('imp_') !== -1) {
							imgUrl = imgUrl.replace("imp_", "");
						}
						imgUrl = imgUrl.split('/');
						let fileName = imgUrl[imgUrl.length - 1].split('.').slice(0, -1).join('.');
						fileName = fileName + '_xxlg';
						let extension = imgUrl[imgUrl.length - 1].split('.').pop();
						imgUrl.pop();
						imgUrl.push(fileName);
						imgUrl = imgUrl.join('/') + '.' + extension;
						imgUrl = location.origin + path + '/' + imgUrl;
						images.push(imgUrl);
					}
				}
			}
			console.log('products', products);
		} else {
			// if (document.querySelector('[data-collection-id]')) {
			// 	let collectionId = document.querySelector('[data-collection-id]').getAttribute('data-collection-id');
			// 	let checkPage = parseInt(pathName[pathName.length - 1]);
			// 	page = isNaN(checkPage) ? null : checkPage;
			// 	if (page) {
			// 		productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64&page=' + page;
			// 	} else
			// 		productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64';
			// }
		}
		// console.log(productUrl);
		let products = [];
	}

	checkUrl(url) {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200) {
					return true;
				} else {
					return request.status;
				}
			}
		};
		request.open("GET", url, true);
		request.send(null);
	}

	pushProduct(callback, campaign_id, products) {
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

	subXhrGetProducts(callback, campaign_id, type, productUrl) {
		let that = this;
		let products = [];
		chrome.runtime.sendMessage({
				method: 'GET',
				action: 'xhttp',
				url: productUrl,
			}, function (responseText) {
				let res_data = JSON.parse(responseText);
				let data = res_data.data;
				if (data.length > 0) {
					let temp_products = [];
					data.forEach(function (v, k) {
						let imageUrl = new URL(v.imageUrl);
						let pathName = imageUrl.pathname.split('/');
						pathName[1] = '857x1200';
						pathName = pathName.join('/');
						let banner = imageUrl.origin + pathName;
						let images = [];
						let tags = [];
						// if (typeof v.images != "undefined")
						//     if (v.images.length > 1)
						//         v.images.forEach(function (value, key) {
						//             images.push(value.src)
						//         });
						temp_products.push({
							type: type,
							title: v.title,
							banner: banner,
							images: images,
							item_id: v.itemCollectionId,
							tags: tags,
							store: location.host,
							market: 'displate'
						})
					});
					products = products.concat(temp_products);
					// console.log(products);
					that.pushProduct(callback, campaign_id, products);
				}
			}
		)
		;
	}
}
