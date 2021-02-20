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
            if (document.body.classList.contains("theme-flatsome") || document.body.classList.contains("woo-variation-swatches-theme-flatsome-child")
                || document.querySelector('#flatsome-main-css')) {
                new Woo();
            } else if (document.querySelector("#shopify-digital-wallet")) {
                new Shopify();
            } else if (typeof window.sbsdk !== "undefined" || document.getElementById('sentry-cdn') != null) {
                injectScript(chrome.extension.getURL('sites/klaviyo.js'), 'body');
            } else if (location.host === "puzzlehd.com") {
                new Puzzlehd();
            } else if (location.host === "displate.com") {
                new Displate();
            } else if (location.host === 'www.impawards.com') {
                new Impawards();
            } else if (document.evaluate("/html/body//script[contains(text(),\"TeeChip\")]", document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue) {
                new Dzeetee();
            } else if (location.host === 'viralstyle.com') {
                new Viralstyle();
            } else if (document.querySelector('.storefront-page') || window.location.pathname === "/_/search" || document.querySelector('body[ng-controller="BuyCtrl"]')) {
                injectScript(chrome.extension.getURL('sites/store_front.js'), 'body');
            } else if (location.host === 'www.teepublic.com') {
                new TeenPublic();
            } else if (location.host === 'www.zazzle.com') {
                new Zazzle();
            } else if (location.host === 'www.walmart.com') {
                new Walmart();
            } else if (document.body.classList.contains("theme-shoptimizer")) {
                new WooShopTimizer();
            } else if (document.body.classList.contains("theme-pangja")) {
                new WooPangja();
            } else if (location.host === 'shirt.woot.com') {
                new ShirtWoot();
            } else if (location.host === 'expressmytee.com') {
                new ExpressMyTee();
            } else if (location.host === 'payonteer.com') {
                new PayOnTeer();
            } else if (location.host === 'eroltos.com') {
                new Eroltos();
            } else if (location.host === 'www.shirtstore.se') {
                new ShirtStore();
            } else if (location.host === 'www.snorgtees.com' && document.querySelector('body.catalog-product-view')) {
                new Snorgtees();
            } else if (document.body.classList.contains("theme-bb-theme")) {
                new WooBbTheme();
            } else if (location.host === 'www.carousell.sg') {
                new Carousell();
            }
            else if(location.host === 'poshmark.com')
            {
                new Poshmard();
            }
            else if(location.host === 'www.anime1688.com')
            {
                new Anime1688();
            }


            function injectScript(file, node) {
                var th = document.getElementsByTagName(node)[0];
                var s = document.createElement('script');
                s.setAttribute('type', 'text/javascript');
                s.setAttribute('src', file);
                s.setAttribute('data-sv', DataCenter);
                s.setAttribute('data-token', token);
                s.setAttribute('data-host', host);
                s.setAttribute('id', 'exp-embed');
                th.appendChild(s);
            }
        }
    }, false
)
;