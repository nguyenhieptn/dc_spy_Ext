let Etsy = class extends Initial{
    constructor() {
        super();
        this.domain = location.origin;
        this.href = location.href;
        this.build();
        this.init();
    }
    init(){
        let button = document.querySelector('button.exp-btn-push')
        button.addEventListener("click", (e)=> {
            e.preventDefault();
            button.classList.add("is-loading");
            if(window.location.pathname.indexOf("listing") !== -1){
                this.getProduct()
            }else{
                this.getProducts()
            }
        });
    }
    getProducts(){
        let keyword = "";
        document.querySelectorAll("input[name=\"search_query\"]").forEach(function(elm){
            let vl = elm.value;
            if(vl.length !== 0){
                keyword = vl;
                return;
            }
        });
        let tags = [];
        if(keyword.length > 0){
            tags = keyword;
        }
        let products = [];
        let store = "";
        if(document.querySelector(".shop-name-and-title-container h1")){
            store = document.querySelector(".shop-name-and-title-container h1").innerText;
        }
        document.querySelectorAll(".v2-listing-card").forEach((el)=>{
            let elm = el.querySelector(".v2-listing-card__img img[data-listing-card-listing-image]");
            if(!elm) return;
            let url = elm.getAttribute("src");
            if(!isURL(url))
            {
                return;
            }
            let banner = url.replace(/340x270/g,"fullxfull");
            let title = el.querySelector(".v2-listing-card .listing-link").getAttribute("title");
            if(title === null)
            {
                title = el.querySelector("h3").textContent.trim();
            }
            if(el.querySelector(".v2-listing-card__shop p")) {
                el.querySelector(".v2-listing-card__shop p").innerText;
            }
            elm = el.querySelector("a.listing-link");
            let item_id = elm.getAttribute("data-listing-id");
            if(!isURL(banner)) return;
            let product = {
                type:"",
                title:title,
                banner:banner,
                item_id:item_id,
                tags: tags,
                store:store,
                market:"etsy"
            };
            products.push(product);
        });
        console.log(products);
        this.push(products);
    }
    getProduct(){
        let keyword = document.querySelector("input[name=\"search_query\"]").value;
        let images = [];
        document.querySelectorAll("[class*=\"listing-page-image\"] [data-image-id] img[data-src-zoom-image]").forEach(function(el){
            let url = el.getAttribute("src");
            if(isURL(url)) {
                images.push(url.replace(/794xN/g, "fullxfull"));
            }
        });
        let banner = images.shift();
        let item_id = document.querySelector("[data-buy-box-listing-title]").getAttribute("data-listing-id");
        if(item_id === null) {
            if (document.querySelector(".favorite-item-action"))
            {
                item_id = document.querySelector(".favorite-item-action").getAttribute("data-listing-id");
            }
            else
            {
                let locationPathName = location.pathname.split("/");
                item_id = locationPathName[2];
                // expToast("error","Cant crawl this page contact dev!");
                // return;
            }
        }
        console.log(item_id)
        let title;
        let store;
        if(document.querySelector("[type=\"application/ld+json\"]"))
        {
            let data = JSON.parse(document.querySelector("[type=\"application/ld+json\"]").innerText);
            title = data.name;
            store = data.brand;
        }
        else{
            store = document.querySelector('#listing-page-cart a.wt-text-link-no-underline span').innerText;
            title = document.querySelector('#listing-page-cart h1').innerText;
        }
        let product = {
            type:"",
            title:title,
            banner:banner,
            item_id:item_id,
            tags:[keyword],
            store:store,
            images:images,
            market:"etsy"
        };
        console.log(product);
        this.push([product]);
    }
};
