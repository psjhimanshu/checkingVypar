//
//
//document.addEventListener("DOMContentLoaded", async () => {
//  const urlParams = new URLSearchParams(window.location.search);
//  const invoiceId = urlParams.get("id");
//
//  if (!invoiceId) {
//    alert("Invoice ID missing in URL");
//    return;
//  }
//
//  try {
//    const res = await fetch(`http://localhost:8080/api/invoices/${invoiceId}`);
//    if (!res.ok) throw new Error("Invoice not found");
//
//    const invoice = await res.json();
//    populateInvoice(invoice);
//  } catch (err) {
//    console.error("Error loading invoice:", err);
//    alert("Failed to load invoice details");
//  }
//});
//
//function populateInvoice(invoice) {
//  document.getElementById("invoiceNumber").textContent = invoice.invoiceNumber || "N/A";
//  document.getElementById("partyName").textContent = invoice.party?.name || "N/A";
//  document.getElementById("invoiceDate").textContent = invoice.date?.substring(0, 10) || "N/A";
//
//  const tbody = document.getElementById("itemTableBody");
//  tbody.innerHTML = "";
//
//  let grandTotal = 0;
//
//  invoice.items.forEach(item => {
//    const row = document.createElement("tr");
//    const total = item.quantity * item.rate;
//    grandTotal += total;
//
//    row.innerHTML = `
//      <td>${item.product?.name || 'N/A'}</td>
//      <td>${item.quantity}</td>
//      <td>₹ ${item.rate.toFixed(2)}</td>
//      <td>₹ ${total.toFixed(2)}</td>
//    `;
//    tbody.appendChild(row);
//  });
//
//  document.getElementById("grandTotal").textContent = `₹ ${grandTotal.toFixed(2)}`;
//}
//



//document.addEventListener("DOMContentLoaded", () => {
//  const printBtn = document.getElementById("printSectionBtn");
//
//  printBtn?.addEventListener("click", () => {
//    const printContents = document.getElementById("printSection").innerHTML;
//    const win = window.open('', '', 'width=900,height=700');
//    win.document.write(`
//      <html>
//        <head>
//          <title>Invoice Print</title>
//          <link rel="stylesheet" href="/css/style.css">
//        </head>
//        <body>${printContents}</body>
//      </html>
//    `);
//    win.document.close();
//    win.focus();
//    win.print();
//    win.close();
//  });
//
//  // Shortcut Alt+P
////  document.addEventListener("keydown", (e) => {
////    if (e.altKey && e.key.toLowerCase() === 'p') {
////      e.preventDefault();
////      printBtn?.click();
////    }
////  });
//});




document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get("id");
  if (!invoiceId) {
    alert("⚠️ Invoice ID missing in URL");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/invoices/${invoiceId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch invoice: ${res.statusText}`);
    }
    const invoice = await res.json();

    document.getElementById("invoiceNumber").textContent = invoice.invoiceNumber || 'N/A';
    document.getElementById("partyName").textContent = invoice.party?.name || 'Unknown';
    // Format date from LocalDateTime (e.g., "2025-07-09T14:30:00" to "2025-07-09")
    document.getElementById("invoiceDate").textContent = invoice.date ? invoice.date.substring(0, 10) : 'N/A';

    const tbody = document.getElementById("itemTableBody");
    let grandTotal = 0;
    let totalQuantity = 0;
    let totalRate = 0;


    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach(item => {
        const row = document.createElement("tr");

        const total = item.rate * item.quantity;
        const tax = (total * item.taxRate) / 100;
        const full = total + tax;
        grandTotal += full;
        totalQuantity += item.quantity;
        totalRate += item.rate;

        row.innerHTML = `
          <td>${item.product?.name || 'Unknown'}(${item.product?.description||'Unknown'})</td>
          <td>${item.quantity}</td>
          <td>₹ ${item.rate.toFixed(2)}</td>
          <td>₹ ${full.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="4">No items found for this invoice.</td></tr>`;
    }

    document.getElementById("grandTotal").textContent = "₹ " + grandTotal.toFixed(2);
    document.getElementById("totalQty").textContent = totalQuantity;
    document.getElementById("totalRate").textContent = "₹ " + totalRate.toFixed(2);

  } catch (error) {
    console.error("Error loading invoice:", error);
    alert("⚠️ Failed to load invoice. Please check the invoice ID or try again.");
    document.getElementById("itemTableBody").innerHTML = `<tr><td colspan="4">Error loading invoice.</td></tr>`;
    document.getElementById("grandTotal").textContent = "₹ 0.00";
  }
});

document.getElementById("printButton").addEventListener("click", () => {
  const printContents = document.getElementById("printSection").innerHTML;

  const win = window.open('', '', 'width=900,height=700');

  win.document.write(`
    <html>
      <head>
        <title>Invoice Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px 12px;
          }



tfoot tr:first-child td:nth-child(2) {
  text-align: center;
}
/* Align total values in tfoot to the right */
tfoot td:last-child {
  text-align: right;
}




          /* Header alignment */
                th:nth-child(1), td:nth-child(1) {
                  text-align: left; /* Product column */
                }
                th:nth-child(2), td:nth-child(2)
                {
                  text-align: center; /* Qty */
                }
                th:nth-child(4), td:nth-child(4) ,
                th:nth-child(3), td:nth-child(3) {
                  text-align: right; /* Rate column and Total columns */
                }


          th {
            background-color: #007bff;
            color: white;
          }
          .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }

        </style>
      </head>
      <body>
        <h1>SS</h1>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p><strong>Party:</strong> ${document.getElementById("partyName").textContent}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Invoice #:</strong> ${document.getElementById("invoiceNumber").textContent}</p>
            <p><strong>Date:</strong> ${document.getElementById("invoiceDate").textContent}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th class="leftalignProduct">Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${document.getElementById("itemTableBody").innerHTML}
          </tbody>
          <tfoot>
          <tr>
              <td colspan=""><strong>Total</strong></td>
              <td><strong>${document.getElementById("totalQty").textContent}</strong></td>
              <td><strong>-</strong></td>
              <td><strong>${document.getElementById("grandTotal").textContent}</strong></td>
            </tr>

          </tfoot>
        </table>
        <div class="footer">

        </div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
  win.close();
});


document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='p'){
e.preventDefault();
document.getElementById("printButton")?.click();
}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
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
