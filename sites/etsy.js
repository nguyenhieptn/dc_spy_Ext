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
        button.addEventListener("click", (e)=> {
            e.preventDefault();
            button.classList.add("is-loading");
            if(this.href.indexOf("listing") !== -1){
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
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if(type.length === 0){
            expToast("error","Please select type!");
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
            if(!isURL(url)) return;
            let banner = url.replace(/340x270/g,"fullxfull");
            let title = el.querySelector(".v2-listing-card .listing-link").getAttribute("title");
            if(el.querySelector(".v2-listing-card__shop p")) {
                el.querySelector(".v2-listing-card__shop p").innerText;
            }
            elm = el.querySelector("a.listing-link");
            let item_id = elm.getAttribute("data-listing-id");
            if(!isURL(banner)) return;
            let product = {
                type:type,
                title:title,
                banner:banner,
                item_id:item_id,
                tags: tags,
                store:store,
                market:"etsy"
            };
            products.push(product);
        });
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
        let type = document.querySelector(".exp-template .exp-select[name=\"product_type\"]").value;
        if(type.length === 0){
            expToast("error","Please select type!");
            return;
        }
        let banner = images.shift();
        let item_id = document.querySelector("[data-buy-box-listing-title]").getAttribute("data-listing-id");
        let data = JSON.parse(document.querySelector("[type=\"application/ld+json\"]").innerText);
        let title = data.name;
        let store = data.brand;
        let product = {
            type:type,
            title:title,
            banner:banner,
            item_id:item_id,
            tags:[keyword],
            store:store,
            images:images,
            market:"etsy"
        };
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