let GrandMatee = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        let that = this;
        window.onload = function () {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                button.classList.add("is-loading");
                if(document.getElementsByClassName('TagPage').length > 0 || document.getElementsByClassName('SearchPage').length > 0)
                {
                    that.getProducts( );
                } else if (document.getElementsByClassName('CampaignPage').length > 0) {
                    that.getProduct()
                } else {
                    expToast("error", "Cant push product this page!");
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
        if(banner == null)
        {
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
        this.pushProduct([product]);
    }

    getProducts() {
        let retailProductList = document.querySelector('.RetailProductList');
        if(retailProductList === null)
        {
            expToast("error", "Cant push product this page!");
            return;
        }
        else
        {
            let items = retailProductList.querySelectorAll('div div div');
            console.log(items);
        }
    }

    pushProduct(products) {
        if (products.length === 0) {
            expToast("error", "No more product!");
            return;
        } else {
            this.push(products);
        }
    }

}
