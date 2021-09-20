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
