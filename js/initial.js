class Initial {
    build() {
        let template = document.createElement("div");
        template.classList.add("exp-template");
        let input = document.createElement("input");
        input.type = "number";
        input.name = "campaign_id";
        input.placeholder = "Campaign ID";
        input.classList.add("exp-input");
        template.appendChild(input);
        let button = document.createElement("button");
        button.classList.add("exp-btn-push");
        button.classList.add("exp-btn");
        button.setAttribute("type", "button");
        button.innerText = "Push Data";
        template.appendChild(button);
        document.body.appendChild(template);

        input.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                button.click();
            }
        })
        if (chrome.storage !== undefined) chrome.storage.sync.get(['previousCampaign'], function (data) {
            console.log(data.previousCampaign);
            if (data.previousCampaign !== undefined) input.value = data.previousCampaign;
        });
    }

    getBlob = async function (url) {
        let that = this;
        return fetch(url).then(response => response.blob())
            .then(async function (blob) {
                return await that.blobToBase64(blob);
            })
    }
    blobToBase64 = blob => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    updateImages = async function (product) {
        let banner = await this.getBlob(product.banner);
        product.banner = banner;
        if (product.images !== undefined && product.images.length > 0) {
            let _images = [];
            let count = 0;
            for (const image of product.images) {
                let img = await this.getBlob(image);
                _images.push(img);
                count++;
                if (count == 5) {
                    break;
                }
            }
            product.images = _images;
        }
    }
    exceptPlatform = () => {
        if (DataCenter == "https://work-space.teamexp.net") {
            let platforms = ['amazon', 'etsy', 'ebay',];
            // platforms = [];
            let urlOrigin = location.host;
            let except = false;
            platforms.forEach(function (platform) {
                if (urlOrigin.indexOf(platform) !== -1) {
                    console.log(platform, platform === "etsy" && location.pathname.indexOf('listing'))
                    if (platform === "etsy" && location.pathname.indexOf('listing/') === -1) {
                        except = platform;
                        return false;
                    }
                }
            })
            console.log(except);
            if (except) {
                document.querySelector("button.exp-btn-push").classList.remove("is-loading");
                expToast("error", "Not support " + except + " platform !");
                return true;
            }
        }
        return false;
    }
    push = async function (products, end = true) {
<<<<<<< HEAD
=======
        console.log(this.exceptPlatform())
>>>>>>> 9bd92330a3833822bd3d2f6762e7e62ac355cee8
        if (this.exceptPlatform()) {
            console.log('end');
            return;
        }
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let key = CryptoJS.MD5(JSON.stringify({
            products: products, campaign_id: campaign_id
        }));
        key = key.toString();
        if (chrome.storage !== undefined)
            chrome.storage.sync.set({
                previousCampaign: campaign_id
            }, function () {
                return campaign_id;
            });
        let _product = [];
        for (const product of products) {
            const _udpated = await this.updateImages(product);
            _product.push(product);
        }
        products = _product;
        console.log(products);

        chrome.runtime.sendMessage({
            action: 'xhttp', method: 'POST', url: DataCenter + "/api/campaigns/products", headers: {
                token: token, "Content-Type": 'multipart/form-data'
            }, data: JSON.stringify({
                products: products, campaign_id: campaign_id, key: key
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            if (data === null) {
                expToast("error", "Please check your config! (missing token)");
            }
            if (data.status === "succeed") {
                expToast("success", "Push Successfully!");
            } else {
                expToast("error", data.msg);
            }
        });
    }

    pushInject = async function (products, end = true, convertImage = false) {
        if (this.exceptPlatform()) {
            console.log('end');
            return;
        }
        let campaign_id = document.querySelector(".exp-template .exp-input[name=\"campaign_id\"]").value;
        if (campaign_id.length === 0) {
            expToast("error", "Please input campaign ID!");
            return;
        }
        let key = CryptoJS.MD5(JSON.stringify({
            products: products,
            campaign_id: campaign_id
        }));
        key = key.toString();
        if (chrome.storage !== undefined)
            chrome.storage.sync.set({
                previousCampaign: campaign_id
            }, function () {
                return campaign_id;
            });
        let _product = [];
        for (const product of products) {
            const _udpated = await this.updateImages(product);
            _product.push(product);
        }
        products = _product;

        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let data = JSON.parse(xhttp.responseText);
            if (data === null) {
                expToast("error", "Please check your config! (missing token)");
            }
            if (data.status === "succeed") {
                expToast("success", "Push Successfully!");
            } else {
                expToast("error", data.msg);
            }
        };
        xhttp.onerror = function () {
            let data = JSON.parse(xhttp.responseText);
            if (data === null) {
                expToast("error", "Please check your config! (missing token)");
            }
            if (data.status === "succeed") {
                expToast("success", "Push Successfully!");
            } else {
                expToast("error", data.msg);
            }
        };
        xhttp.open("POST", '//' + this.host + "/api/campaigns/products", true);
        xhttp.setRequestHeader("token", this.token);
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhttp.send(JSON.stringify({
            products: products,
            campaign_id: campaign_id,
            key: key
        }));
    }
}
