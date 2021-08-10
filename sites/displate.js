let Displate = class  extends Initial{
	constructor() {
		super();
		this.domain = location.origin;
		this.build();
		this.init();
	}

	init() {
		let that = this;
		window.onload = function () {
			let button = document.querySelector('button.exp-btn-push');
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.getElementById('react-product-page')) {
					that.getProduct();
				} else if (document.getElementById('collection-page') || window.location.pathname.indexOf('sr-artworks') != -1)
					that.getProducts()
			})
		}
	}

	getProduct(callback) {
		let productContainer = document.getElementsByClassName('product-page-actions-container')[0];
		let title = productContainer.querySelector('h1.heading-3').textContent;
		let productSlice = document.getElementsByClassName('product-page-image-slider-container')[0];
		let firstImage = productSlice.querySelector('.nav-btn-box').firstChild;
		let imageUrl = firstImage.querySelector('img').getAttribute('src');
		let banner = imageUrl;
		// let pathName = imageUrl.pathname.split('/');
		// let filename = pathName[pathName.length - 1];
		let pId = window.location.pathname.split('/');
		pId = pId[pId.length - 1];
		let products = [{
			type: type,
			title: title,
			banner: banner,
			images: [],
			item_id: pId,
			tags: [],
			store: location.host,
			market: 'displate'
		}];
		this.pushProduct(products);
	}

	getProducts(callback) {
		let pathName = window.location.pathname.split('/');
		let orientation = '';
		if (window.location.search.indexOf('orientation')) {
			orientation = window.location.search;
			if (orientation.indexOf('?') !== -1) {
				orientation = '&' + orientation.replace('?', "");
			}
		}
		let productUrl, page;
		if (pathName.indexOf('sr-artworks') !== -1) {
			let search;
			search = pathName[pathName.indexOf('sr-artworks') + 1];
			console.log(search);
			page = typeof pathName[pathName.indexOf('sr-artworks') + 2] !== undefined ? pathName[pathName.indexOf('sr-artworks') + 2] : null;

			if (page) {
				productUrl = 'https://sapi.displate.com/search/artworks?miso=US&phrase=' + search + '&size=64&page=' + page + orientation;
			} else
				productUrl = 'https://sapi.displate.com/search/artworks?miso=US&phrase=' + search + '&size=64' + orientation;;
		} else {
			if (document.querySelector('[data-collection-id]')) {
				let collectionId = document.querySelector('[data-collection-id]').getAttribute('data-collection-id');
				let checkPage = parseInt(pathName[pathName.length - 1]);
				page = isNaN(checkPage) ? null : checkPage;
				if (page) {
					productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64&page=' + page + orientation;;
				} else
					productUrl = 'https://sapi.displate.com/collections/' + collectionId + '/artworks/search?size=64' + orientation;;
			}
		}
		console.log(productUrl);
		let products = [];
		let that = this;
		setTimeout(function () {
			that.subXhrGetProducts(callback, productUrl);
		}, 4000)

	}

	pushProduct(products) {
		if (products.length === 0) {
			expToast("error", "No more product!");
			return;
		} else {
			this.push(products);
		}
	}

	subXhrGetProducts(callback, productUrl) {
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
						temp_products.push({
							type: "",
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
					console.log(products);
					that.pushProduct(products);
				}
			}
		);
	}
}
