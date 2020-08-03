function parseHTML(html) {
  let t = document.createElement('template');
  t.innerHTML = html;
  return t.content.cloneNode(true);
}
function expToast(type, msg) {
  console.log(type,msg);
  let x = document.getElementById("exp-snackbar");
  x.innerText = msg;
  x.className = "";
  x.classList.add("show");
  x.classList.add(type);
  setTimeout(function(){ x.className = ""; }, 3000);
}