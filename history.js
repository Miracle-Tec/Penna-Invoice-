const historyKey = "pennaHistory";
const saveInvoiceBtn = document.getElementById("saveInvoiceBtn");
const historyList = document.getElementById("historyList");

function getHistory() {
  try {
   return JSON.parse(localStorage.getItem(historyKey)) || [];
  } catch (error) {
    return [];
  }
}

function setHistory(list) {
  localStorage.setItem(historyKey, JSON.stringify(list));
}

function currentInvoice() {
  const fields = {};

  ["clientName", "clientEmail", "clientAddress",
   "invoiceNumber", "invoiceDate", "dueDate", "taxRate"].forEach(function (id) {
    fields[id] = document.getElementById(id).value;
  });

  const items = [];

  tableBody.querySelectorAll("tr").forEach(function (row) {
    items.push({
      desc: row.querySelector(".itemDesc").value,
      qty: row.querySelector(".itemQty").value,
      price: row.querySelector(".itemPrice").value
    });
  });

  return {
    id: Date.now(),
    fields: fields,
    items: items,
    status: document.getElementById("status").value,
    total: grandTotalEl.textContent
  };
}

function openInvoice(id) {
  const invoice = getHistory().find(function (item) {
    return item.id === id;
  });
  if (!invoice) return;

  for (const fieldId in invoice.fields) {
    document.getElementById(fieldId).value = invoice.fields[fieldId];
  }

  document.getElementById("status").value = invoice.status;

  tableBody.innerHTML = "";
  invoice.items.forEach(function (item) {
    addRow(item.desc, item.qty, item.price);
  });
  if (invoice.items.length === 0) addRow();

  saveItems();
  saveFields();
  updateStamp();
  refreshAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteInvoice(id) {
  if (!confirm("Delete this saved invoice?")) return;

  setHistory(getHistory().filter(function (item) {
    return item.id !== id;
  }));
  renderHistory();
}

function renderHistory() {
  const list = getHistory();
  historyList.innerHTML = "";

  if (list.length === 0) {
    historyList.textContent = "No saved invoices yet.";
    return;
  }

  list.forEach(function (invoice) {
    const row = document.createElement("div");
    row.className = "history-item";

    const info = document.createElement("span");
    info.textContent =
      (invoice.fields.invoiceNumber || "No number") + " · " +
      (invoice.fields.clientName || "No client") + " · " +
      invoice.total + " · " +
      (invoice.status === "paid" ? "Paid" : "Unpaid");

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", function () {
      openInvoice(invoice.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteInvoice(invoice.id);
    });

    row.appendChild(info);
    row.appendChild(openBtn);
    row.appendChild(deleteBtn);
    historyList.appendChild(row);
  });
}

saveInvoiceBtn.addEventListener("click", function () {
  const invoice = currentInvoice();
  const list = getHistory();
  const number = invoice.fields.invoiceNumber.trim();

  const existing = number
    ? list.findIndex(function (item) {
        return item.fields.invoiceNumber.trim() === number;
      })
    : -1;

  if (existing >= 0) {
    invoice.id = list[existing].id;
    list[existing] = invoice;
  } else {
    list.unshift(invoice);
  }

  setHistory(list);
  renderHistory();
});

renderHistory();
