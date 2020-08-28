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
            } else if (typeof window.sbsdk !== "undefined" || document.getElementById('sentry-cdn') != null ) {
                new Klaviyo();
            } else if (location.host === "puzzlehd.com") {
                new Puzzlehd();
            } else if (location.host === "displate.com") {
                new Displate();
            }else if (location.host === 'www.impawards.com')
            {
                new Impawards();
            }
            else if (location.host === 'www.dzeetee.com')
            {
                console.log('dvh');
                new Dzeetee();
            }
        }
    },
    false
)
;