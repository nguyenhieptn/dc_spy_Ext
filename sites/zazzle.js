let Zazzle = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.build();
        this.init();
    }

    init() {
        let button = document.querySelector('button.exp-btn-push');
        let that = this;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            button.classList.add("is-loading");
            if(document.querySelector('div.SearchResults')){
                console.log("product");
                that.getProducts();
            }else
            if (document.querySelector('div.CmsPdpProductSpace_root') || document.querySelector('section.sectionType--pdpProductSpace')) {
                that.getProduct();
            } else {
                expToast("error", "Cant push this page!");
            }
        });
    }

    getProducts(){
        let products = [];
        document.querySelectorAll("div.SearchResults div.SearchResults-cell").forEach((el)=>{
            let elm = el.querySelector("div.SearchResultsGridCellRealview--loaded img");
            if(elm === null)
            {
                return;
            }
            let banner = elm.getAttribute("src");
            banner = banner.replace("307.jpg", "5000.jpg");
            let images = [];
            let image_alt  = el.querySelector("div.SearchResultsGridCellRealview-altRealviewWrapper img");
            if(image_alt)
            {
                image_alt = image_alt.getAttribute('src')
                image_alt = image_alt.replace("307.jpg", "5000.jpg");
                images.push(image_alt);
            }
            if(!isURL(banner))
            {
                return;
            }
            let title = elm.getAttribute("alt");
            let url = el.querySelector("a.Link").getAttribute('href');
            let pId = url.substr(22);
            let tags = [];
            let store = "zazzle";
            let type = "";
            let product = {
                type:type,
                title:title,
                banner:banner,
                images: images,
                item_id:pId,
                tags:tags,
                store:store,
                market:"zazzle"
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }
    getProduct() {
        let title = document.querySelector("h1.ProductTitle-title").innerText;
        let store = "zazzle";
        let pId = location.href.substr(22);
        let images = [];
        if (document.querySelectorAll(".ViewSelectorItem-image").length > 0)
            document.querySelectorAll(".ViewSelectorItem-image").forEach(function (el) {
                let image = el.getAttribute("src");
                image = image.replace('max_dim=65', 'max_dim=1000');
                images.push(image);
            });
        else{
            expToast("error","Error crawl images!");
            return;
        }
        let banner = images.shift();
        let type = "";
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        let product = {
            type: type,
            title: title,
            banner: banner,
            images: images,
            item_id: pId,
            store: store,
            market: "zazzle"
        };
        console.log(product);
        this.push([product]);
    }
};
