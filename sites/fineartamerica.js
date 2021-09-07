let Fineartamerica = class extends Initial{
	constructor() {
		super();
		this.domain = location.origin;
		this.href = location.href;
		this.build()
		this.init();
	}

	init() {
			let button = document.querySelector('button.exp-btn-push');
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.add("is-loading");
				console.log(document.querySelector("#bodyProduct"));
				if (document.querySelector("#bodyProduct")) {
					this.getProduct()
				}
				else if(document.getElementsByClassName('searchEngineRightDiv'))
				{
					this.getProducts()
				}
				else
					expToast("error", 'Cant crawl this page!');
			});
	}

	getProduct() {
		let title = document.querySelector("#h1title").innerText;
		let images = [];
		document.querySelectorAll("#additionalImageContainerDiv .additionalImageImageDiv").forEach(function (v, k) {
			let imgUrl = v.querySelector('img').getAttribute('data-url-large');
			images.push(imgUrl);
		});
		let banner = images.shift();
		if (!isURL(banner)) {
			expToast("error", "Cant get image!");
			return;
		}
		let pId = null;
		pId = location.pathname + location.search;
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
			market: "fineartamerica"
		};
		console.log(product);
		this.push([product])
	}

	getProducts() {
		let products = [];
		let containerProducts;
		containerProducts = document.querySelectorAll('#searchEngineResultsParentDiv .searchengineresultdiv')
		containerProducts.forEach((el) => {
				if (el.querySelector('img.imageSearchEngineProduct')) {
					let title = el.querySelector('.imageTitle').textContent.trim();
					let banner = el.querySelector('img.imageSearchEngineProduct').getAttribute('data-src');
					let images = [];
					let pId = el.querySelector('a').getAttribute('href');
					let tags = [];
					let product = {
						type: "",
						title: title,
						banner: banner,
						item_id: pId,
						tags: tags,
						store: location.host,
						market: location.host
					};
					products.push(product);
				}
			}
		);
		console.log(products);
		this.push(products);
	}
};
