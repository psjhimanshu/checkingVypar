document.addEventListener("keydown", function(e){

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }


if(e.altKey && e.key.toLowerCase()==='x'){
e.preventDefault();
document.getElementById("navAddParty")?.click();
}

if(e.altKey && e.key.toLowerCase()==='2'){
e.preventDefault();
document.getElementById("navViewParty")?.click();
}

if(e.altKey && e.key.toLowerCase()==='c'){
e.preventDefault();
document.getElementById("navAddProduct")?.click();
}

if(e.altKey && e.key.toLowerCase()==='4'){
e.preventDefault();
document.getElementById("navViewProducts")?.click();
}

if(e.altKey && e.key.toLowerCase()==='v'){
e.preventDefault();
document.getElementById("navInvoice")?.click();
}

if(e.altKey && e.key.toLowerCase()==='6'){
e.preventDefault();
document.getElementById("navInvoiceList")?.click();
}

if(e.altKey && e.key.toLowerCase()==='l'){
e.preventDefault();
document.getElementById("navPartyLedger")?.click();
}

if(e.altKey && e.key.toLowerCase()==='r'){
e.preventDefault();
document.getElementById("navPayment")?.click();
}

});
