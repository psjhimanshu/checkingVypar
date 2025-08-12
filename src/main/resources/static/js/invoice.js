document.addEventListener("DOMContentLoaded", () => {
  loadParties();
  loadProducts();
  document.getElementById("invoiceDate").value = new Date().toISOString().slice(0, 16);
  loadInvoiceNumber();
//  addItem();
setTimeout(() => {
  addItem(); // test if item loads after 1s
}, 1000);
});




async function loadParties() {
  const res = await fetch("http://localhost:8080/api/parties");
  const parties = await res.json();
  const select = document.getElementById("partySelect");
  parties.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.type})`;
    select.appendChild(opt);
  });
}

let products = [];

async function loadProducts() {
  const res = await fetch("http://localhost:8080/api/products");
  products = await res.json();
//  addItem();
//loadParties();
}

async function loadInvoiceNumber(){
    const res=await fetch("http://localhost:8080/api/invoices/next-number");
    const number = await res.text();
    document.querySelector("input[name='invoiceNumber']").value=number;
}

async function updateItemRate(itemDiv, partyId, productId) {
  if (partyId && productId) {
    try {
      const res = await fetch(`http://localhost:8080/api/invoices/last-price/${partyId}/${productId}`);
      const lastPrice = await res.json();
      const rateInput = itemDiv.querySelector(".rate");
      rateInput.value = lastPrice || 0;
    } catch (err) {
      console.error("Error fetching last price:", err);
    }
  }
}

function addItem() {
console.log("addItem() triggered");

  const partyId = document.getElementById("partySelect").value;

  const itemDiv = document.createElement("div");
  itemDiv.className = "item";
  itemDiv.innerHTML = `
    <select class="productId">
      ${products.map(p => `<option value="${p.id}">${p.name} (${p.description})</option>`).join("")}
    </select>
    Qty: <input type="number" class="quantity" value="1" min="1"/>
    Rate: <input type="number" class="rate" value="0"/>
    <button type="button" onclick="this.parentElement.remove()" id="removeBtn">❌ (Alt+R)</button>
    <br/>
  `;

  document.getElementById("items").appendChild(itemDiv);

  const productSelect = itemDiv.querySelector(".productId");
  const quantityInput = itemDiv.querySelector(".quantity");
  const rateInput = itemDiv.querySelector(".rate");


  // 🔁 Product change triggers rate update
  productSelect.addEventListener("change", () => {
    const productId = productSelect.value;
    updateItemRate(itemDiv, partyId, productId);
  });

  // ⌨️ Keyboard navigation: Enter to move focus
  productSelect.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      quantityInput.focus();
    }
  });

  quantityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      rateInput.focus();
    }
  });

  rateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const productId = productSelect.value;
      const qty = quantityInput.value;
      const rate = rateInput.value;
      if (productId && qty && rate) {
        addItem(); // 🔁 add next item
      }
    }
  });

  // 🎯 Focus on first input in this item row
  productSelect.focus();
}

window.addItem = addItem;



document.getElementById("partySelect").addEventListener("change", () => {
  const partyId = document.getElementById("partySelect").value;
  const items = document.querySelectorAll(".item");
  items.forEach(item => {
    const productId = item.querySelector(".productId").value;
    updateItemRate(item, partyId, productId);
  });
});


document.getElementById("invoiceForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  const items = Array.from(document.querySelectorAll(".item")).map(item => ({
    product: { id: item.querySelector(".productId").value },
    quantity: parseInt(item.querySelector(".quantity").value),
    rate: parseFloat(item.querySelector(".rate").value)

  }));

  const invoice = {
    invoiceNumber: form.invoiceNumber.value,
    party: { id: form.partyId.value },
    date:form.invoiceDate.value,
    items
  };

  try {
  console.log(invoice)
    const res = await fetch("http://localhost:8080/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoice)
    });

    if (res.ok) {
      const savedInvoice = await res.json(); // get the created invoice object (must be returned by backend)
        alert("✅ Invoice created successfully!");
        window.location.href = `/invoicePrint?id=${savedInvoice.id}`;
      form.reset();
      document.getElementById("items").innerHTML = "";

      document.getElementById("invoiceDate").value=new Date().toISOString().slice(0,16);
      loadInvoiceNumber();
    } else {
      const result = await res.json();
      alert("❌ Error: " + result.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Server error.");
  }
});

document.addEventListener("keydown", function(e) {
  const active = document.activeElement;
  const items = Array.from(document.querySelectorAll(".item input, .item select"));
  const index = items.indexOf(active);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = items[index + 1];
    if (next) next.focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = items[index - 1];
    if (prev) prev.focus();
  } else if (e.key === "Escape") {
    if (active.tagName === "SELECT") {
      active.blur(); // close dropdown
    }
  }
});


document.addEventListener("keydown", function(e){

if (e.altKey && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    document.getElementById("addItemBtn")?.click(); // Alt + N = Add Item
  }
if (e.altKey && e.key.toLowerCase() === 'r') {
    e.preventDefault();
    document.getElementById("removeBtn")?.click(); // Alt + R = Add Item
  }



  if(e.altKey && e.key.toLowerCase()==='s'){
  e.preventDefault();
  document.getElementById("submitInvoiceBtn")?.click();
  }

  if(e.key === "Escape"){
    e.preventDefault();
    document.getElementById("homePage")?.click();
    }


  if(e.altKey && e.key.toLowerCase()==='p'){
 e.preventDefault();
 document.getElementById("partySelect")?.focus();
  }

  if(e.altKey && e.key.toLowerCase()==='d'){
  e.preventDefault();
  document.getElementById("invoiceDate")?.focus();
  }

   if(e.altKey && e.key.toLowerCase()==='i'){
  e.preventDefault();
  document.getElementById("invoiceNumber")?.focus();
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

