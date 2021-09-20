var token = false;
var host = false;
var DataCenter = null;
var user = null;
function isURL(str) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
}
let html = "<div id=\"exp-snackbar\"></div>";
document.body.appendChild(parseHTML(html));
chrome.storage.local.get(["user"],function(data){
  if(data.user === undefined) return false;
  token = data.user.api_token;
  host = data.user.api_host;
  user = data.user;
  if(host.length === 0) return;
  if(host.indexOf("https") === 0 || host.indexOf("http") === 0) DataCenter = host;
  else DataCenter = "https://"+host;
});
