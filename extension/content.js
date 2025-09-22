const button = document.createElement("button");
button.innerText = "Rome 🤖";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.zIndex = 9999;
button.style.padding = "10px 15px";
button.style.background = "#4f46e5";
button.style.color = "white";
button.style.borderRadius = "8px";
document.body.appendChild(button);

button.addEventListener("click", () => {
  alert("Rome will open here soon 🚀");
  // later → inject chat window (iframe pointing to popup.html)
});
