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
        if (chrome.storage !== undefined)
            chrome.storage.sync.get(['previousCampaign'], function (data) {
                console.log(data);
                if (data !== 'undefined')
                    input.value = data.previousCampaign;
            });
    }

    push(products) {
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
        console.log(key);
        chrome.storage.sync.set({previousCampaign: campaign_id}, function () {
            return campaign_id;
        });
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: products,
                campaign_id: campaign_id,
                key: key
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            if(data === null)
            {
                expToast("error", "Please check your config! (missing token)");
            }
            if (data.status === "succeed") {
                expToast("success", "Push Successfully!");
            } else {
                expToast("error", data.msg);
            }
            document.querySelector("button.exp-btn-push").classList.remove("is-loading");
        });
    }

}
