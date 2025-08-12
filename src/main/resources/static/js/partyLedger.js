
document.getElementById("showAll").addEventListener("click", () => renderLedger("all"));
document.getElementById("showDebit").addEventListener("click", () => renderLedger("debit"));
document.getElementById("showCredit").addEventListener("click", () => renderLedger("credit"));

document.getElementById("clearDateFilter").addEventListener("click", () => {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  renderLedger(window.currentLedgerType || "all");
});

document.getElementById("searchBox").addEventListener("input", () => {
  const searchValue = document.getElementById("searchBox").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  renderLedger(window.currentLedgerType || "all", start, end, searchValue);
});


document.addEventListener("DOMContentLoaded", () => {
  loadParties();

  document.getElementById("ledgerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const partyId = document.getElementById("partySelect").value;
    if (!partyId) {
      alert("⚠️ Please select a party.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/invoices/by-party/${partyId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch invoices: ${res.statusText}`);
      }
      const invoices = await res.json();


// Fetch payments
      const paymentRes = await fetch(`http://localhost:8080/api/payment/by-party/${partyId}`);
      if (!paymentRes.ok) {
        throw new Error(`Failed to fetch payments: ${paymentRes.statusText}`);
      }
      const payments = await paymentRes.json();


      const tbody = document.getElementById("ledgerBody");
      tbody.innerHTML = "";

      if (invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No invoices found for this party.</td></tr>`;
        document.getElementById("grandTotalCell").textContent = "₹ 0.00";
        document.getElementById("ledgerTable").style.display = "table";
        return;
      }

      let grandTotal = 0;
      invoices.forEach(inv => {
        const row = document.createElement("tr");

        let subtotal = 0, taxTotal = 0;
        inv.items.forEach(item => {
          const amt = item.rate * item.quantity;
          subtotal += amt;
          taxTotal += (amt * item.taxRate) / 100;
        });

        const total = subtotal + taxTotal;
        grandTotal += total;

        // Format date from LocalDateTime (e.g., "2025-07-09T14:30:00" to "2025-07-09")
        const formattedDate = inv.date ? inv.date.substring(0, 10) : 'N/A';

        row.innerHTML = `
          <td>${inv.invoiceNumber}</td>
          <td>${formattedDate}</td>
          <td>₹ ${subtotal.toFixed(2)}</td>
          <td>-</td>
        `;
        tbody.appendChild(row);

      });


// Process payments (Credit)
      payments.forEach(payment => {
        const row = document.createElement("tr");
const formattedDate = payment.dateTime
  ? new Date(payment.dateTime).toISOString().substring(0, 10)
  : 'N/A';

        row.innerHTML = `
          <td>${payment.paymentNumber}</td>
          <td>${formattedDate}</td>
          <td>-</td>
          <td>₹ ${payment.amount.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
        grandTotal -= payment.amount; // Subtract payment from grand total
      });


// Save raw data for filtering later
        window.rawInvoices = invoices;
        window.rawPayments = payments;

        // Call this after rendering
        renderLedger("all");
      document.getElementById("grandTotalCell").textContent = "₹ " + grandTotal.toFixed(2);
      document.getElementById("ledgerTable").style.display = "table";
    } catch (error) {
      console.error("Error loading ledger:", error);
      alert("⚠️ Failed to load invoices. Please try again.");
      document.getElementById("ledgerTable").style.display = "none";
    }
  });
});

async function loadParties() {
  try {
    const res = await fetch("http://localhost:8080/api/parties");
    if (!res.ok) {
      throw new Error(`Failed to fetch parties: ${res.statusText}`);
    }
    const parties = await res.json();
    const select = document.getElementById("partySelect");
    select.innerHTML = `<option value="">-- Select Party --</option>`;
    parties.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.type})`;
      select.appendChild(opt);
    });
  } catch (error) {
    console.error("Error loading parties:", error);
    alert("⚠️ Failed to load parties. Please try again.");
  }
}


//document.getElementById("filterBtn").addEventListener("click", async () => {
//  const startDate = document.getElementById("startDate").value;
//  const endDate = document.getElementById("endDate").value;
//
//  if (!startDate || !endDate) {
//    alert("Please select both start and end dates.");
//    return;
//  }
//
//  try {
//    const res = await fetch(`http://localhost:8080/partyLedger/filter?start=${startDate}&end=${endDate}`);
//    const invoices = await res.json();
//
//    const tbody = document.getElementById("ledgerBody");
//    tbody.innerHTML = ""; // clear previous rows
//
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
//          <a href="/invoicePrint?id=${invoice.id}" target="_blank">🖨️ Print</a>
//        </td>
//      `;
//
//      tbody.appendChild(tr);
//    });
//
//  } catch (error) {
//    console.error("Error filtering invoices:", error);
//    alert("Error loading filtered invoices.");
//  }
//});


document.getElementById("filterBtn").addEventListener("click", () => {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!start || !end) {
    alert("Please select both start and end dates.");
    return;
  }

  renderLedger(window.currentLedgerType || "all", start, end);
});


//function renderLedger(type = "all") {
function renderLedger(type = "all", startDate = null, endDate = null, searchText = "")
{
//}
  const tbody = document.getElementById("ledgerBody");
  searchText = searchText.trim().toLowerCase();
  tbody.innerHTML = "";

  let grandTotal = 0;

  if (type === "all" || type === "debit") {
    window.rawInvoices.forEach(inv => {
      const row = document.createElement("tr");

const entryDate = inv.date?.substring(0, 10);
    const matchText = `${inv.invoiceNumber} ${inv.party?.name || ''}`.toLowerCase();

        if (
          (startDate && entryDate < startDate) ||
          (endDate && entryDate > endDate) ||
          (searchText && !matchText.includes(searchText))
        ) return;

      let subtotal = 0, taxTotal = 0;
      inv.items.forEach(item => {
        const amt = item.rate * item.quantity;
        subtotal += amt;
        taxTotal += (amt * item.taxRate) / 100;
      });

      const total = subtotal + taxTotal;
      grandTotal += total;

      const formattedDate = inv.date ? inv.date.substring(0, 10) : 'N/A';
      row.innerHTML = `
        <td>${inv.invoiceNumber}</td>
        <td>${formattedDate}</td>
        <td>₹ ${subtotal.toFixed(2)}</td>
        <td>-</td>
      `;
      tbody.appendChild(row);
    });
  }

  if (type === "all" || type === "credit") {
    window.rawPayments.forEach(payment => {
      const row = document.createElement("tr");
const formattedDate = payment.dateTime
  ? new Date(payment.dateTime).toISOString().substring(0, 10)
  : 'N/A';

const entryDate = payment.dateTime?.substring(0, 10);
    const matchText = `${payment.paymentNumber} ${payment.party?.name || ''}`.toLowerCase();

        if (
          (startDate && entryDate < startDate) ||
          (endDate && entryDate > endDate) ||
          (searchText && !matchText.includes(searchText))
        ) return;


      row.innerHTML = `
        <td>${payment.paymentNumber}</td>
        <td>${formattedDate}</td>
        <td>-</td>
        <td>₹ ${payment.amount.toFixed(2)}</td>
      `;
      tbody.appendChild(row);

      grandTotal -= payment.amount;
    });
  }

  document.getElementById("grandTotalCell").textContent = "₹ " + grandTotal.toFixed(2);
  document.getElementById("ledgerTable").style.display = "table";
}


document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='p'){
e.preventDefault();
document.getElementById("partySelect")?.focus();
}

if(e.ctrlKey && e.key.toLowerCase()==='f'){
e.preventDefault();
document.getElementById("startDate")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='e'){
e.preventDefault();
document.getElementById("endDate")?.focus();
}

//if(e.altKey && e.key.toLowerCase()==='h'){
//e.preventDefault();
//document.getElementById("searchBox")?.click();
//}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }

if(e.altKey && e.key.toLowerCase()==='l'){
e.preventDefault();
document.getElementById("showLedgerBtn")?.click();
}

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("searchBox")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='a'){
e.preventDefault();
document.getElementById("showAll")?.click();
}

if(e.altKey && e.key.toLowerCase()==='d'){
e.preventDefault();
document.getElementById("showDebit")?.click();
}

if(e.altKey && e.key.toLowerCase()==='c'){
e.preventDefault();
document.getElementById("showCredit")?.click();
}

if(e.altKey && e.key.toLowerCase()==='r'){
e.preventDefault();
document.getElementById("clearDateFilter")?.click();
}

if(e.altKey && e.key.toLowerCase()==='f'){
e.preventDefault();
document.getElementById("filterBtn")?.click();
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
