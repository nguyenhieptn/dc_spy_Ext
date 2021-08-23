let Mikeypet = class extends Initial {
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if (document.querySelector('.viewbox')) {
                this.getProduct();
            } else if (document.querySelector('.product_list') || document.querySelector('ul.common_pro_list1')) {
                this.getProducts()
            } else
                expToast("error", 'Cant crawl this page!');
        });
    }

    getProduct() {
        let container = document.querySelector('div.viewbox');
        let title = container.querySelector('.product_detail_h1').innerText.trim();
        let banner;
        let images = [];
        document.querySelectorAll('.viewimg_list li a').forEach(function (el, k){
            let imageUrl = new URL(el.getAttribute('data_img'));
            imageUrl = imageUrl.origin+imageUrl.pathname;
            images.push(imageUrl);
        });
        banner = images.shift();
        let pId = null;
        pId = location.pathname;
        if (!pId) return;
        let tags = [];
        if (!isURL(banner)) {
            expToast("error", "Cant get image!");
            return;
        }
        let product = {
            type: "",
            title: title,
            banner: banner,
            item_id: pId,
            tags: tags,
            images: images,
            store: location.host,
            market: location.host
        };
        console.log(product);
        this.push([product]);
    }

    getProducts() {
        let products = [];
        let containerProducts;
        if(document.querySelector('.product_list'))
        {
            containerProducts = document.querySelectorAll('.product_list a.pic')
        }
        else if(document.querySelector('ul.common_pro_list1'))
        {
            containerProducts = document.querySelectorAll("ul.common_pro_list1 a.pic")
        }
        containerProducts.forEach((el) => {
                if (el.querySelector('img')) {
                    let title = el.getAttribute('title');
                    let banner = new URL(el.querySelector('img').getAttribute("src"));
                    banner = banner.origin+banner.pathname;
                    let pId =  el.getAttribute('href');
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
