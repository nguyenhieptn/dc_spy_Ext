let DataCenter = "https://datacenter.tokamedia.com";
let body = document.querySelector("body");
let form = document.querySelector("form");
let tokenInp = document.querySelector("#token");
let hostInp = document.querySelector("#host");
let submitBtn = document.querySelector("#submit");
let errorHtm = document.querySelector("#error");

chrome.storage.local.get(["user"], function (data) {
  if (data.user) {
    tokenInp.value = data.user.api_token;
    hostInp.value = data.user.api_host;
  }
});

tokenInp.addEventListener("focus", function (e) {
  errorHtm.style.display = "none";
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let token = tokenInp.value;
  let host = hostInp.value;
  if (token && host) {
    DataCenter = "https://" + host;
    chrome.runtime.sendMessage({
      method: 'GET',
      action: 'xhttp',
      url: DataCenter + "/api/users/get",
      headers: {
        token: token,
      }
    }, function (responseText) {
      console.log(responseText);
      let data = JSON.parse(responseText);
      if (data.type === "succeed") {
        data.user["api_host"] = host;
        chrome.storage.local.set({user: data.user});
        errorHtm.innerText = data.user.name;
        errorHtm.style.display = "block";
        tokenInp.value = data.user.api_token;
        hostInp.value = data.user.api_host;
      } else {
        errorHtm.innerText = data.msg;
        errorHtm.style.display = "block";
      }
    });
  }
});