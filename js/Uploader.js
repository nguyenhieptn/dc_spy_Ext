class Uploader {
    constructor() {
        this.accessToken = gapi.auth.getToken().accessToken;
        this.metadata = {
            // 'name': (+new Date).toString(36), // Filename at Google Drive
            // 'mimeType': 'text/plain', // mimeType at Google Drive
            'parents': ['### folder ID ###'], // Folder ID at Google Drive
        };
    }

    saveFile(url) {
        chrome.runtime.sendMessage({
            action: 'xhttp',
            method: 'POST',
            url: DataCenter + "/api/campaigns/products",
            headers: {
                token: token
            },
            data: JSON.stringify({
                products: products,
                campaign_id: campaign_id
            })
        }, function (responseText) {
            let data = JSON.parse(responseText);
            if (data.status === "succeed") {
                expToast("success", "Push Successfully!");
            } else {
                expToast("error", data.msg);
            }
            document.querySelector("button.exp-btn-push").classList.remove("is-loading");
        });
    }
}