chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action === "xhttp") {
        let options = {
            url:request.url,
            data:request.data,
            headers:request.headers,
            method:request.method ? request.method.toUpperCase() : 'GET'
        };
        xhr(options, callback);
        return true;
    }
    return false;
});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd === "get_html") {
        xhr({
            url: chrome.extension.getURL("content_scripts.html")
        },sendResponse);
    }
})

function xhr(options,callback){
    let xhttp = new XMLHttpRequest();
    let method = options.method ? options.method.toUpperCase() : 'GET';

    xhttp.onload = function() {
        callback(xhttp.responseText);
    };
    xhttp.onerror = function() {
        callback();
    };
    xhttp.open(method, options.url, true);
    if(options.headers){
        for(let key in options.headers){
            xhttp.setRequestHeader(key, options.headers[key]);
        }
    }
    if (method === 'POST' || method === 'PUT') {
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    }
    xhttp.send(options.data);
}
// disable CORS
'use strict';

// Tests:
// https://mail.google.com/mail/u/0/#inbox
// https://drive.google.com/drive/my-drive


const DEFAULT_METHODS = ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'PROPFIND', 'PROPPATCH', 'MKCOL', 'COPY', 'MOVE', 'LOCK'];

const prefs = {
  'enabled': true,
  'overwrite-origin': true,
  'methods': DEFAULT_METHODS,
  'remove-x-frame': true,
  'allow-credentials': true,
  'allow-headers-value': '*',
  'allow-origin-value': '*',
  'expose-headers-value': '*',
  'allow-headers': false,
  'unblock-initiator': true
};

const redirects = {};
chrome.tabs.onRemoved.addListener(tabId => delete redirects[tabId]);
const cors = {};

cors.onBeforeRedirect = d => {
  if (d.type === 'main_frame') {
    return;
  }
  redirects[d.tabId] = redirects[d.tabId] || {};
  redirects[d.tabId][d.requestId] = true;
};

cors.onHeadersReceived = d => {
  if (d.type === 'main_frame') {
    return;
  }
  const {initiator, originUrl, responseHeaders, requestId, tabId} = d;
  let origin = '';

  const redirect = redirects[tabId] ? redirects[tabId][requestId] : false;
  if (prefs['unblock-initiator'] && redirect !== true) {
    try {
      const o = new URL(initiator || originUrl);
      origin = o.origin;
    }
    catch (e) {
      console.warn('cannot extract origin for initiator', initiator);
    }
  }
  else {
    origin = '*';
  }
  if (redirects[tabId]) {
    delete redirects[tabId][requestId];
  }

  if (prefs['overwrite-origin'] === true) {
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-origin');

    if (o) {
      if (o.value !== '*') {
        o.value = origin || prefs['allow-origin-value'];
      }
    }
    else {
      responseHeaders.push({
        'name': 'Access-Control-Allow-Origin',
        'value': origin || prefs['allow-origin-value']
      });
    }
  }
  if (prefs.methods.length > 3) { // GET, POST, HEAD are mandatory
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-methods');
    if (o) {
      // only append methods that are not in the supported list
      o.value = [...new Set([...prefs.methods, ...o.value.split(/\s*,\s*/).filter(a => {
        return DEFAULT_METHODS.indexOf(a) === -1;
      })])].join(', ');
    }
    else {
      responseHeaders.push({
        'name': 'Access-Control-Allow-Methods',
        'value': prefs.methods.join(', ')
      });
    }
  }
  // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'
  // when the request's credentials mode is 'include'.
  if (prefs['allow-credentials'] === true) {
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-origin');
    if (!o || o.value !== '*') {
      const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-credentials');
      if (o) {
        o.value = 'true';
      }
      else {
        responseHeaders.push({
          'name': 'Access-Control-Allow-Credentials',
          'value': 'true'
        });
      }
    }
  }
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
  if (prefs['allow-headers'] === true) {
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-headers');
    if (o) {
      o.value = prefs['allow-headers-value'];
    }
    else {
      responseHeaders.push({
        'name': 'Access-Control-Allow-Headers',
        'value': prefs['allow-headers-value']
      });
    }
  }
  if (prefs['allow-headers'] === true) {
    const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-expose-headers');
    if (o) {
      o.value = prefs['expose-headers-value'];
    }
    else {
      responseHeaders.push({
        'name': 'Access-Control-Expose-Headers',
        'value': prefs['expose-headers-value']
      });
    }
  }
  if (prefs['remove-x-frame'] === true) {
    const i = responseHeaders.findIndex(({name}) => name.toLowerCase() === 'x-frame-options');
    if (i !== -1) {
      responseHeaders.splice(i, 1);
    }
  }
  return {responseHeaders};
};
cors.install = () => {
  const extra = ['blocking', 'responseHeaders'];
  if (/Firefox/.test(navigator.userAgent) === false) {
    extra.push('extraHeaders');
  }
  chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
    urls: ['<all_urls>']
  }, extra);
  chrome.webRequest.onBeforeRedirect.addListener(cors.onBeforeRedirect, {
    urls: ['<all_urls>']
  });
};

cors.onCommand = () => {
  cors.install();
};

chrome.storage.local.get(prefs, ps => {
  Object.assign(prefs, ps);
  cors.onCommand();
});

console.log(prefs);
