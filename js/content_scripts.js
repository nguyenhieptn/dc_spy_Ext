document.addEventListener('readystatechange', function () {
        if (location.host === "www.etsy.com") {
            new Etsy();
        } else if (location.host === "www.redbubble.com") {
            new Redbubble();
        } else if (location.host === "www.amazon.com") {
            new Amazon();
        } else if (location.host === "www.ebay.com") {
            new Ebay();
        } else {
            if (document.body.classList.contains("theme-flatsome") || document.body.classList.contains("woo-variation-swatches-theme-flatsome-child")) {
                new Woo();
            } else if (document.querySelector("#shopify-digital-wallet")) {
                new Shopify();
            } else if (typeof window.sbsdk !== "undefined" || document.getElementById('sentry-cdn') != null) {
                new Klaviyo();
            } else if (location.host === "puzzlehd.com") {
                new Puzzlehd();
            } else if (location.host === "displate.com") {
                new Displate();
            } else if (location.host === 'www.impawards.com') {
                new Impawards();
            } else if (document.evaluate("/html/body//script[contains(text(),\"TeeChip\")]", document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue) {
                //teechip
                new Dzeetee();
            } else if (location.host === 'viralstyle.com') {
                new Viralstyle();
            } else if (location.host === 'designby9.net') {
                new StoreFront();
            }
            else if (location.host === 'www.teepublic.com') {
                new TeenPublic();
            }
        }
    }, false
)
;