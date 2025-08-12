document.addEventListener("DOMContentLoaded", () => {
  loadParties();

  document.getElementById("paymentDate").value = new Date().toISOString().slice(0, 16);
  loadPaymentNumber();
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

async function loadPaymentNumber(){
    const res=await fetch("http://localhost:8080/api/payment/next-number");
    const number = await res.text();
    document.querySelector("input[name='paymentNumber']").value=number;
}


document.getElementById("partySelect").addEventListener("change", () => {
  const partyId = document.getElementById("partySelect").value;
  const items = document.querySelectorAll(".item");
  items.forEach(item => {
    const productId = item.querySelector(".productId").value;
//    updateItemRate(item, partyId, productId);
  });
});


document.getElementById("paymentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;

  const items = Array.from(document.querySelectorAll(".item")).map(item => ({
    product: { id: item.querySelector(".productId").value },
    quantity: parseInt(item.querySelector(".quantity").value),
    rate: parseFloat(item.querySelector(".rate").value),
    amount:parseFloat(item.querySelector(".amount").value)||0

  }));

  const payment = {
    paymentNumber: form.paymentNumber.value,
    party: { id: form.partyId.value },
    date:form.paymentDate.value,
    amount:form.amount.value,
    items
  };

  try {
  console.log(payment)
    const res = await fetch("http://localhost:8080/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment)
    });

    if (res.ok) {
      alert("✅ Invoice created successfully!");
      form.reset();
      document.getElementById("items").innerHTML = "";

      document.getElementById("paymentDate").value=new Date().toISOString().slice(0,16);
      loadPaymentNumber();
    } else {
      const result = await res.json();
      alert("❌ Error: " + result.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Server error.");
  }
});


document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='p'){
e.preventDefault();
document.getElementById("partySelect")?.focus();
}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }

if(e.altKey && e.key.toLowerCase()==='n'){
e.preventDefault();
document.getElementById("paymentNumber")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='d'){
e.preventDefault();
document.getElementById("paymentDate")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("submitPaymentBtn")?.click();
}

if(e.altKey && e.key.toLowerCase()==='a'){
e.preventDefault();
document.getElementById("amount")?.focus();
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
