const numberInput = document.getElementById("invoiceNumber");
const counterKey = "pennaLastNumber";

function readNumber(text) {
  const match = /^INV-(\d+)$/i.exec((text || "").trim());
  return match ? Number(match[1]) : 0;
}

function highestSaved() {
  let max = 0;

  try {
    const list = JSON.parse(localStorage.getItem("pennaHistory")) || [];
    list.forEach(function (invoice) {
      const n = readNumber(invoice.fields && invoice.fields.invoiceNumber);
      if (n > max) max = n;
    });
  } catch (error) {
    max = 0;
  }

  return max;
}

function lastUsed() {
  const stored = Number(localStorage.getItem(counterKey)) || 0;
  return Math.max(stored, highestSaved(), readNumber(numberInput.value));
}

function fillIfEmpty() {
  if (numberInput.value.trim() !== "") return;

  const next = lastUsed() + 1;
  localStorage.setItem(counterKey, String(next));
  numberInput.value = "INV-" + String(next).padStart(4, "0");
  numberInput.dispatchEvent(new Event("input", { bubbles: true }));
}

numberInput.addEventListener("input", function () {
  const n = readNumber(numberInput.value);
  if (n > (Number(localStorage.getItem(counterKey)) || 0)) {
    localStorage.setItem(counterKey, String(n));
  }
});

numberInput.addEventListener("blur", fillIfEmpty);

const newInvoiceButton = document.getElementById("newInvoiceBtn");
if (newInvoiceButton) newInvoiceButton.addEventListener("click", fillIfEmpty);

fillIfEmpty();