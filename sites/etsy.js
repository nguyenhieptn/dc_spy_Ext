let Etsy = class {
    constructor() {
        this.domain = location.origin;
        this.href = location.href;
        this.init();
    }
    init(){
        let template = document.createElement("div");
        template.classList.add("exp-template");
        let input = document.createElement("input");
        input.name = "campaign_id";
        input.placeholder = "Campaign ID";
        input.classList.add("exp-input");
        template.appendChild(input);
        let button = document.createElement("button");
        button.classList.add("exp-btn");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);
        button.addEventListener("click", (e)=> {
            e.preventDefault();
            button.classList.add("is-loading");
            if(window.location.pathname.indexOf("listing") !== -1){
                this.getProduct((data)=>{
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            }else{
                this.getProducts((data)=>{
                    button.classList.remove("is-loading");
                    if (data.status === "succeed") {
                        expToast("success", "Push Successfully!");
                    } else {
                        expToast("error", data.msg);
                    }
                })
            }
        });
    }
    getProducts(callback){
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
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if(campaign_id.length === 0){
            expToast("error","Please input campaign ID!");
            return;
        }
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
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token:token
            },
            data:JSON.stringify({
                products:products,
                campaign_id:campaign_id
            })
        }, function(responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }
    getProduct(callback){
        console.log('dvh');
        let keyword = document.querySelector("input[name=\"search_query\"]").value;
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if(campaign_id.length === 0){
            expToast("error","Please input campaign ID!");
            return;
        }
        let images = [];
        document.querySelectorAll("[class*=\"listing-page-image\"] [data-image-id] img[data-src-zoom-image]").forEach(function(el){
            let url = el.getAttribute("src");
            if(isURL(url)) {
                images.push(url.replace(/794xN/g, "fullxfull"));
            }
        });
        let banner = images.shift();
        let item_id = document.querySelector("[data-buy-box-listing-title]").getAttribute("data-listing-id");
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
            title = document.querySelector('#listing-page-cart div[data-component="listing-page-title-component"] h1').innerText;
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
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/product",
            headers: {
                token:token
            },
            data:JSON.stringify({
                product:product,
                campaign_id:campaign_id
            })
        }, function(responseText) {
            let data = JSON.parse(responseText);
            callback(data);
        });
    }
};