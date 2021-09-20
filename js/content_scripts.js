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
            if (
                document.body.classList.contains("theme-flatsome")
                || document.body.classList.contains("woo-variation-swatches-theme-flatsome-child")
                || document.body.classList.contains("theme-oxygen-is-not-a-theme") || document.querySelector('#flatsome-main-css')) {
                new Woo();
            } else if (document.querySelector("body.wvs-theme-resources")) {
                new WooThemeCanvas();
            }
            else if (document.querySelector("#shopify-digital-wallet")) {
                new Shopify();
            } else if (typeof window.sbsdk !== "undefined" || document.getElementById('sentry-cdn') != null) {
                injectScript(chrome.extension.getURL('sites/klaviyo.js'), 'body');
            } else if (location.host === "puzzlehd.com") {
                new Puzzlehd();
            } else if (location.host === "displate.com") {
                new Displate();
            } else if (location.host === 'www.impawards.com') {
                new Impazazzlewards();
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
            } else if (location.host === 'poshmark.com') {
                new Poshmard();
            } else if (location.host === 'www.anime1688.com') {
                new Anime1688();
            } else if (location.host === 'www.wish.com') {
                new Wish();
            } else if (location.host === 'www.shopdisney.com') {
                new ShopDisney();
            } else if (location.host === 'www.hottopic.com') {
                new HotTopic();
            } else if (location.host === 'society6.com') {
                new Society6();
            } else if (location.host === 'www.tisortfabrikasi.com') {
                new Tisortfabrikasi();
            } else if (document.querySelector('body.theme-storefront') || ((document.querySelector('body.archive') || document.querySelector('body.single-product')) &&  document.querySelector('body.woocommerce'))) {
                new WooStoreFront();
            } else if (location.host === "www.gearbubble.com" || ['www.familysistershops.com'].indexOf(location.host) !== -1) {
                new GearBubble();
            } else if (location.host === "www.theshirtlist.com") {
                new TheShirtList();
            } else if (location.host === "www.forfansbyfans.com") {
                new ForFanByFans();
            } else if (location.host === "www.merchbar.com") {
                new MerchBar();
            } else if (location.host === "www.nerdkungfu.com") {
                new NerdKungfu();
            } else if (location.host === "www.europosters.eu") {
                new EuroPosters();
            } else if (location.host === "moosfy.com") {
                new Moosfy();
            } else if (location.host === "eigengift.com") {
                new Eigengift();
            } else if (location.host === "www.ktecknonltd.com") {
                new Ktecknonltd();
            } else if (location.host === "www.wyierblog.com") {
                new Wyierblog();
            } else if (location.host === "www.zavvi.com") {
                new Zavvi();
            } else if (location.host === "shirtbea.com" || location.host === "shirtoont.com") {
                new Codeigniter();
            } else if (location.host === "www.teeshirtpalace.com") {
                new Teeshirtpalace();
            }
            else if (location.host === "www.mhempearth.com") {
                new mhempearth();
            }
            else if (location.host === "www.spreadshirt.com") {
                new Spreadshirt();
            }else if (location.host === "fineartamerica.com") {
                new Fineartamerica();
            }else if (location.host === "www.lorajewel.com") {
                new Lorajewel();
            }else if (location.host === "www.ubuy.com.pl") {
                new Ubuy();
            }else if (location.host === "www.rdynolabs.com") {
                new Rdynolabs();
            }else if (location.host === "www.mumzworld.com") {
                new Mumzworld();
            }else if (location.host === "www.fanatics.com") {
                new Fanatics();
            }else if (location.host === "www.pngitem.com") {
                new Pngitem();
            }else if (location.host === "www.carstickers.com") {
                new Carstickers();
            }else if (location.host === "getstickerpack.com") {
                new Getstickerpack();
            }else if (location.host === "peastores.com") {
                new Peastores();
            }else if (location.host === "chaest.com") {
                new Chaest();
            }else if (location.host === "www.mikeypet.com") {
                new Mikeypet();
            }
            else if (location.host === "cosandi.com") {
                new Cosandi();
            }
            else if (location.host === "www.chyroll.com") {
                new Chyroll();
            }else if (location.host === "sealiontee.com") {
                new Sealiontee();
            }else if (document.querySelector('#wix-first-paint')) {
                new Wix();
            }
            else if (location.host === "trendsdelta.com") {
                new Trendsdelta();
            }
            else if(document.querySelector('#scroll-mark'))
            {
                new StyledComponents()
            }
            else if(location.host === 'www.gourmeturca.com')
            {
                new Gourmeturca()
            }

            function injectScript(file, node) {
                let th = document.getElementsByTagName(node)[0];
                let initial =  document.createElement('script');
                initial.setAttribute('type', 'text/javascript');
                initial.setAttribute('src', chrome.extension.getURL('js/initial.js'));
                initial.setAttribute('data-sv', DataCenter);
                initial.setAttribute('data-token', token);
                initial.setAttribute('data-host', host);
                initial.setAttribute('id', 'exp-embed-initial');
                th.appendChild(initial);

                let s = document.createElement('script');
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
