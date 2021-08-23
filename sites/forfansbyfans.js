let ForFanByFans = class extends Initial {
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build();
		this.init();
	}

	init() {
		if (document.querySelector('.exp-template') !== null) {
			let button = document.querySelector('button.exp-btn-push');
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				if (document.querySelector(".mainSection .detailPage")) {
					this.getProduct()
				} else if (document.querySelector('.mainSection .searchPage')) {
					this.getProducts()
				} else
					expToast("error", 'Cant crawl this page!');
			});
		}
	}

	getProduct() {
		let title = document.querySelector(".detailPage .product-info .topInfo h3").innerText;
		let images = [];
		if (document.querySelector("#gallerySlider") !== null) {
			document.querySelectorAll('#gallerySlider .slide').forEach(function (v, k) {
				console.log(v.querySelector('a').getAttribute('href'))
				images.push(v.querySelector('a').getAttribute('href'))
			})
		}
		let banner = images.shift();
		console.log(images);
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let pId = null;
		pId = window.location.pathname;
		if (!pId) return;
		let tags = [];
		console.log(images, banner);
		let product = {
			type: "",
			title: title,
			banner: banner,
			item_id: pId,
			tags: tags,
			images: images,
			store: location.host,
			market: "forfansbyfans"
		};
		console.log(product);
		this.push([product]);
	}

	getProducts() {
		let products = [];
		document.querySelectorAll(".searchPage .productList .marginInner div").forEach((el) => {
				if (el.querySelector(".item img.img-responsive")) {
					let title = el.querySelector(".item img.img-responsive").getAttribute('title');
					let banner = el.querySelector(".item img.img-responsive").getAttribute("src");
					banner = banner.replace('280x280', '1000x1000');
					if (isURL(banner) && banner != null) {
						let pId = new URL(el.querySelector("a").getAttribute("href"));
						pId = pId.pathname;
						let tags = [];
						let product = {
							type: "",
							title: title,
							banner: banner,
							item_id: pId,
							tags: tags,
							store: location.host,
							market: "forfansbyfans"
						};
						products.push(product);
					}
				}
			}
		);
		console.log(products);
		this.push(products)
	}
};
