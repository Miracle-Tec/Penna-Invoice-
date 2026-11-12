const payLinkInput = document.getElementById("payLink");
const qrBox = document.getElementById("qrBox");
const qrTarget = document.getElementById("qrCode");
let qrObject = null;

function updateQR() {
  const link = payLinkInput.value.trim();
  localStorage.setItem("pennaPayLink", link);

  if (!link || typeof QRCode === "undefined") {
    qrBox.style.display = "none";
    return;
  }

  qrBox.style.display = "block";

  if (!qrObject) {
    qrObject = new QRCode(qrTarget, { text: link, width: 110, height: 110 });
  } else {
    qrObject.makeCode(link);
  }
}

payLinkInput.value = localStorage.getItem("pennaPayLink") || "";
payLinkInput.addEventListener("input", updateQR);
updateQR();