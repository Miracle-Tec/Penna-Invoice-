const statusSelect = document.getElementById("status");
const stamp = document.getElementById("stamp");

function updateStamp() {
  const isPaid = statusSelect.value === "paid";
  stamp.textContent = isPaid ? "PAID" : "UNPAID";
  stamp.className = "stamp " + (isPaid ? "paid" : "unpaid");
  localStorage.setItem("pennaStatus", statusSelect.value);
}

const savedStatus = localStorage.getItem("pennaStatus");
if (savedStatus) statusSelect.value = savedStatus;

statusSelect.addEventListener("change", updateStamp);
updateStamp();