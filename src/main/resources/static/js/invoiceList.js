let allInvoices = []; // Global variable to keep data




document.addEventListener("DOMContentLoaded", async () => {

document.getElementById("searchBox").addEventListener("input", () => {
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  filterInvoices(query);
});

  try {
    const res = await fetch("http://localhost:8080/api/invoices");
    const invoices = await res.json();
    console.log(invoices);
    allInvoices = invoices; // Store for filtering
    renderInvoices(allInvoices);
    const tbody = document.getElementById("invoiceTableBody");

//    invoices.forEach(invoice => {
//      const tr = document.createElement("tr");
//
//      const totalAmount = invoice.items.reduce((sum, item) => {
//        const amount = item.rate * item.quantity;
//        const tax = (amount * item.taxRate) / 100;
//        return sum + amount + tax;
//      }, 0);
//
//      tr.innerHTML = `
//        <td>${invoice.invoiceNumber}</td>
//        <td>${invoice.party?.name || 'Unknown'}</td>
//        <td>${invoice.date?.substring(0, 10) || ''}</td>
//        <td>₹ ${totalAmount.toFixed(2)}</td>
//        <td>
//          <a href="/invoicePrint?id=${invoice.id}" target="_blank" id="printBtn">🖨️ Print (Alt+P)</a>
//        </td>
//      `;
//
//      tbody.appendChild(tr);
//    });

//// Add event listeners to print buttons
//    document.querySelectorAll(".printButton").forEach(button => {
//      button.addEventListener("click", async () => {
//        const invoiceId = button.getAttribute("data-invoice-id");
//        await printSingleInvoice(invoiceId);
//      });
//    });


  } catch (error) {
    console.error("Failed to load invoices", error);
    alert("Error loading invoices");
//    document.getElementById("invoiceTableBody").innerHTML = `<tr><td colspan="5">Error loading invoices.</td></tr>`;
  }
});

document.getElementById("filterBtn").addEventListener("click", async () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/invoices/filter?start=${startDate}&end=${endDate}`);
    const invoices = await res.json();

    const tbody = document.getElementById("invoiceTableBody");
    tbody.innerHTML = ""; // clear previous rows

    [...invoices].reverse().forEach(invoice => {
      const tr = document.createElement("tr");

      const totalAmount = invoice.items.reduce((sum, item) => {
        const amount = item.rate * item.quantity;
        const tax = (amount * item.taxRate) / 100;
        return sum + amount + tax;
      }, 0);

      tr.innerHTML = `
        <td>${invoice.invoiceNumber}</td>
        <td>${invoice.party?.name || 'Unknown'}</td>
        <td>${invoice.date?.substring(0, 10) || ''}</td>
        <td>₹ ${totalAmount.toFixed(2)}</td>
        <td>
          <a href="/invoicePrint?id=${invoice.id}" target="_blank" id="printBtn">🖨️ Print (Alt+P)</a>
          <button class="deleteBtn" data-id="${invoice.id}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error filtering invoices:", error);
    alert("Error loading filtered invoices.");
  }
});


function renderInvoices(data) {
  const tbody = document.getElementById("invoiceTableBody");
  tbody.innerHTML = "";

  [...data].reverse().forEach(invoice => {
    const tr = document.createElement("tr");

    const totalAmount = invoice.items.reduce((sum, item) => {
      const amount = item.rate * item.quantity;
      const tax = (amount * item.taxRate) / 100;
      return sum + amount + tax;
    }, 0);

    const date = invoice.date?.substring(0, 10) || '';
    const party = invoice.party?.name?.toLowerCase() || '';
    const invoiceNo = invoice.invoiceNumber?.toLowerCase() || '';

    tr.innerHTML = `
      <td>${invoice.invoiceNumber}</td>
      <td>${invoice.party?.name || 'Unknown'}</td>
      <td>${date}</td>
      <td>₹ ${totalAmount.toFixed(2)}</td>
      <td>
        <a href="/invoicePrint?id=${invoice.id}" target="_blank" id="printBtn">🖨️ Print (Alt+P)</a>
        <button class="deleteBtn" data-id="${invoice.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });


  document.querySelectorAll(".deleteBtn").forEach(button => {
    button.addEventListener("click", async () => {
      const invoiceId = button.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this invoice?")) {
        try {
          const res = await fetch(`http://localhost:8080/api/invoices/${invoiceId}`, {
            method: "DELETE"
          });
          if (res.ok) {
            alert("Invoice deleted!");
            allInvoices = allInvoices.filter(inv => inv.id !== parseInt(invoiceId));
            renderInvoices(allInvoices); // re-render updated list
          } else {
            alert("Failed to delete invoice.");
          }
        } catch (err) {
          console.error(err);
          alert("Server error.");
        }
      }
    });
  });

}


function filterInvoices(searchText) {
  const filtered = allInvoices.filter(inv => {
    const party = inv.party?.name?.toLowerCase() || "";
    const invoiceNo = inv.invoiceNumber?.toLowerCase() || "";
    const date = inv.date?.substring(0, 10) || "";

    return (
      party.includes(searchText) ||
      invoiceNo.includes(searchText) ||
      date.includes(searchText)
    );
  });

  renderInvoices(filtered.reverse());
}






document.addEventListener("keydown", function(e) {
  const focusable = Array.from(document.querySelectorAll("input, button, select, a"));
  const index = focusable.indexOf(document.activeElement);

  let next = null;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    next = focusable[index + 1];
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    next = focusable[index - 1];
  }

  if (next) next.focus();
});





document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("searchBox")?.focus();
}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }

if(e.ctrlKey && e.key.toLowerCase()==='f'){
e.preventDefault();
document.getElementById("startDate")?.focus();
}
if(e.altKey && e.key.toLowerCase()==='e'){
e.preventDefault();
document.getElementById("endDate")?.focus();
}


if(e.altKey && e.key.toLowerCase()==='f'){
e.preventDefault();
document.getElementById("filterBtn")?.click();
}

if(e.altKey && e.key.toLowerCase()==='p'){
e.preventDefault();
document.getElementById("printBtn")?.click();
}

if(e.altKey && e.key.toLowerCase()==='1'){
e.preventDefault();
document.getElementById("navAddParty")?.click();
}

if(e.altKey && e.key.toLowerCase()==='2'){
e.preventDefault();
document.getElementById("navViewParty")?.click();
}

if(e.altKey && e.key.toLowerCase()==='3'){
e.preventDefault();
document.getElementById("navAddProduct")?.click();
}

if(e.altKey && e.key.toLowerCase()==='4'){
e.preventDefault();
document.getElementById("navViewProducts")?.click();
}

if(e.altKey && e.key.toLowerCase()==='5'){
e.preventDefault();
document.getElementById("navInvoice")?.click();
}

if(e.altKey && e.key.toLowerCase()==='6'){
e.preventDefault();
document.getElementById("navInvoiceList")?.click();
}

if(e.altKey && e.key.toLowerCase()==='7'){
e.preventDefault();
document.getElementById("navPartyLedger")?.click();
}

if(e.altKey && e.key.toLowerCase()==='8'){
e.preventDefault();
document.getElementById("navPayment")?.click();
}

});
