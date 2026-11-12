// ===== Penna: complete script.js =====

function money(amount) {
  return "\u20A6" + Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const addItemBtn = document.getElementById("addItemBtn");
const tableBody = document.querySelector("#itemsTable tbody");
const taxRateInput = document.getElementById("taxRate");
const subtotalEl = document.getElementById("subtotal");
const taxAmountEl = document.getElementById("taxAmount");
const grandTotalEl = document.getElementById("grandTotal");
const outItemsBody = document.querySelector("#outItems tbody");

function addRow(desc = "", qty = 0, price = "") {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="itemDesc" placeholder="Item description"></td>
    <td><input type="number" class="itemQty" min="0"></td>
    <td><input type="number" class="itemPrice" placeholder="0.00" min="0"></td>
  `;

  row.querySelector(".itemDesc").value = desc;
  row.querySelector(".itemQty").value = qty;
  row.querySelector(".itemPrice").value = price;

  tableBody.appendChild(row);
}

function saveItems() {
  const items = [];

  tableBody.querySelectorAll("tr").forEach(function (row) {
    items.push({
      desc: row.querySelector(".itemDesc").value,
      qty: row.querySelector(".itemQty").value,
      price: row.querySelector(".itemPrice").value
    });
  });

  localStorage.setItem("pennaItems", JSON.stringify(items));
}

function loadItems() {
  const saved = localStorage.getItem("pennaItems");
  if (!saved) return;

  const items = JSON.parse(saved);
  if (items.length === 0) return;

  tableBody.innerHTML = "";
  items.forEach(function (item) {
    addRow(item.desc, item.qty, item.price);
  });
}

function calculateTotals() {
  let subtotal = 0;

  tableBody.querySelectorAll("tr").forEach(function (row) {
    const qty = Number(row.querySelector(".itemQty").value) || 0;
    const price = Number(row.querySelector(".itemPrice").value) || 0;
    subtotal += qty * price;
  });

  const taxRate = Number(taxRateInput.value) || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  subtotalEl.textContent = money(subtotal);
  taxAmountEl.textContent = money(taxAmount);
  grandTotalEl.textContent = money(grandTotal);
}

const savedFields = [
  "bizName", "bizEmail", "bizPhone", "bizAddress",
  "clientName", "clientEmail", "clientAddress",
  "invoiceNumber", "invoiceDate", "dueDate", "taxRate",
  "bankName", "accountName", "accountNumber"
];

function saveFields() {
  const data = {};

  savedFields.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });

  localStorage.setItem("pennaFields", JSON.stringify(data));
}

function loadFields() {
  const saved = localStorage.getItem("pennaFields");
  if (!saved) return;

  const data = JSON.parse(saved);

  savedFields.forEach(function (id) {
    const el = document.getElementById(id);
    if (el && data[id] !== undefined) el.value = data[id];
  });
}

const previewMap = {
  bizName: "outBizName",
  bizEmail: "outBizEmail",
  bizPhone: "outBizPhone",
  bizAddress: "outBizAddress",
  clientName: "outClientName",
  invoiceNumber: "outInvoiceNumber",
  invoiceDate: "outInvoiceDate",
  dueDate: "outDueDate",
  bankName: "outBankName",
  accountName: "outAccountName",
  accountNumber: "outAccountNumber"
};

const fallbacks = {
  bizName: "Your business name",
  clientName: "Client name"
};

function updatePreview() {
  for (const formId in previewMap) {
    const input = document.getElementById(formId);
    const output = document.getElementById(previewMap[formId]);
    if (!input || !output) continue;

    output.textContent = input.value || fallbacks[formId] || "";
  }
}

function updatePreviewItems() {
  outItemsBody.innerHTML = "";

  tableBody.querySelectorAll("tr").forEach(function (row) {
    const desc = row.querySelector(".itemDesc").value;
    const qty = Number(row.querySelector(".itemQty").value) || 0;
    const price = Number(row.querySelector(".itemPrice").value) || 0;

    if (!desc && !price) return;

    const tr = document.createElement("tr");
    [desc, qty, money(price), money(qty * price)].forEach(function (text) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });
    outItemsBody.appendChild(tr);
  });

  document.getElementById("outSubtotal").textContent = subtotalEl.textContent;
  document.getElementById("outTax").textContent = taxAmountEl.textContent;
  document.getElementById("outGrandTotal").textContent = grandTotalEl.textContent;
}

function refreshAll() {
  calculateTotals();
  updatePreview();
  updatePreviewItems();
}

addItemBtn.addEventListener("click", function () {
  addRow();
  saveItems();
  refreshAll();
});

tableBody.addEventListener("input", function () {
  saveItems();
  refreshAll();
});

savedFields.forEach(function (id) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", function () {
      saveFields();
      refreshAll();
    });
  }
});

loadFields();
loadItems();
refreshAll();

document.getElementById("newInvoiceBtn").addEventListener("click", function () {
  if (!confirm("Start a new invoice? Client details, dates and items will be cleared. Your business details are kept.")) {
    return;
  }

  ["clientName", "clientEmail", "clientAddress",
   "invoiceNumber", "invoiceDate", "dueDate"].forEach(function (id) {
    document.getElementById(id).value = "";
  });

  document.getElementById("status").value = "unpaid";

  tableBody.innerHTML = "";
  addRow();
  saveItems();

  saveFields();
  updateStamp();
  refreshAll();
});


const togglePreviewBtn = document.getElementById("togglePreviewBtn");
const invoiceSection = document.getElementById("invoice");

togglePreviewBtn.addEventListener("click", function () {
  const hidden = invoiceSection.classList.toggle("is-hidden");
  togglePreviewBtn.textContent = hidden ? "Show invoice preview" : "Hide invoice preview";
});