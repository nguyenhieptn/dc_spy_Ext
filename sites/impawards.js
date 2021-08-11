let Impawards = class extends Initial {
	constructor() {
		super();
		this.domain = location.origin;
		this.build();
		this.init();
	}

	init() {
		let button = document.querySelector('button.exp-btn-push')
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
					that.getProducts();
				} else if (document.getElementsByClassName('rightsidesmallbordered').length > 0) {
					that.getProduct()
				} else {
					expToast("error", "Cant push product!");
				}
			})
		}
	}

	getProduct() {
		let productContainer = document.getElementsByClassName('rightsidesmallbordered')[0].closest('.container').querySelector('.row');
		let locationBaseName = location.href.replace(/^.*\/|\.[^.]*$/g, '');
		let origin = location.href.slice(location.href.indexOf(locationBaseName), location.href.length);
		origin = location.href.replace(origin, '');
		let banner = productContainer.querySelector('.col-sm-6:first-child p[class="small"] a img');
		if (banner == null) {
			banner = productContainer.querySelector('.col-sm-6:first-child p[class="small"] img');
		}
		banner = banner.getAttribute('src');
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
		console.log(product);
		this.pushProduct( [product]);
	}

	_getProduct( product, designs, origin) {
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
		this.___getProduct( product, designs, origin, url)

	}

	___getProduct( product, designs, origin, url) {
		let request = new XMLHttpRequest();
		let that = this;
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200) {
					product.images.push(origin + url);
					if (designs.length > 0) {
						that._getProduct( product, designs, origin)
					} else {
						that.pushProduct( [product]);
					}
				} else if (url.indexOf('_xxlg') !== -1) {
					url = url.replace('_xxlg', '_xlg');
					that.___getProduct( product, designs, origin, url)
				} else if (url.indexOf('_xlg') !== -1) {
					url = url.replace('_xlg', '');
					product.images.push(origin + url);
					if (designs.length > 0) {
						that._getProduct( product, designs, origin)
					} else {
						that.pushProduct( [product]);
						console.log(product);
					}
				}
			}
		};
		request.open("GET", url, true);
		request.send(null);
	}

	pushProduct( products) {
		if (products.length === 0) {
			expToast("error", "No more product!");
			return;
		} else {
			this.push(products)
		}
	}
}
