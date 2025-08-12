
let allParties = [];

document.getElementById("partySearch")?.addEventListener("input", function () {
  console.log("Search input event triggered");
  searchParty();
});

const partyForm = document.getElementById("partyForm");
if (partyForm) {
  partyForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    // ... rest of the code
     const form = e.target;
      const data = {
        name: form.name.value,
        type: form.type.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        blocked: false
      };

      try {
        const response = await fetch("http://localhost:8080/api/parties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert("Party added successfully!");
          form.reset();
        } else {
          alert("Failed to add party.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error.");
      }
    });
  }
//document.getElementById("partyForm").addEventListener("submit", async function (e) {
//  e.preventDefault();





// Fetch and display parties
async function fetchParties() {
  try {
    const response = await fetch("http://localhost:8080/api/parties");
    const parties = await response.json();
    const partyList = document.getElementById("partyList");
    if (partyList) {
      partyList.innerHTML = "";
      parties.forEach(party => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${party.name}</td>
          <td>${party.type}</td>
          <td>${party.phone}</td>
          <td>${party.email}</td>
          <td>${party.address}</td>
          <td>${party.blocked ? "Blocked" : "Active"}</td>
          <td>
            <button onclick="showUpdateForm(${party.id}, '${party.name}', '${party.type}', '${party.phone}', '${party.email}', '${party.address}', ${party.blocked})">Edit</button>
          </td>
        `;
        partyList.appendChild(row);
      });
    }
    allParties=parties;
    renderPartyList(allParties);

  } catch (error) {
    console.error("Error fetching parties:", error);
    alert("Failed to load parties.");
  }
}

// Show update form
function showUpdateForm(id, name, type, phone, email, address, blocked) {
  const formContainer = document.getElementById("updateFormContainer");
  enableKeyboardFormNavigation(document.getElementById("updatePartyForm"));

  if (formContainer) {
    formContainer.innerHTML = `
      <h3>Update Party</h3>
      <form id="updatePartyForm">
        <input type="hidden" name="id" value="${id}">
        <label>Name:</label>
        <input type="text" name="name" value="${name}" required><br>
        <label>Type:</label>
        <select name="type" required>
          <option value="Customer" ${type === "Customer" ? "selected" : ""}>Customer</option>
          <option value="Supplier" ${type === "Supplier" ? "selected" : ""}>Supplier</option>
        </select><br>
        <label>Phone:</label>
        <input type="text" name="phone" value="${phone}" required><br>
        <label>Email:</label>
        <input type="email" name="email" value="${email}" required><br>
        <label>Address:</label>
        <input type="text" name="address" value="${address}" required><br>
        <button type="submit">Update</button>
      </form>
    `;

    formContainer.querySelector("input[name='name']")?.focus(); // autofocus
    enableArrowKeyNavigation();

    document.getElementById("updatePartyForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        id: form.id.value,
        name: form.name.value,
        type: form.type.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
        blocked: blocked
      };
      try {
        const response = await fetch(`http://localhost:8080/api/parties/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          alert("Party updated successfully!");
          formContainer.innerHTML = "";
          fetchParties();
        } else {
          alert("Failed to update party.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error.");
      }
    });
  }
}

// Delete party
async function deleteParty(id) {
  if (confirm("Are you sure you want to delete this party?")) {
    try {
      const response = await fetch(`http://localhost:8080/api/parties/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        alert("Party deleted successfully!");
        fetchParties();
      } else {
        alert("Failed to delete party.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error.");
    }
  }
}

// Toggle block status
async function toggleBlockParty(id, currentStatus) {
  try {
    const response = await fetch(`http://localhost:8080/api/parties/${id}/block`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      alert(`Party ${currentStatus ? "unblocked" : "blocked"} successfully!`);
      fetchParties();
    } else {
      alert("Failed to toggle block status.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error.");
  }
}


function searchParty() {
  console.log("allParties:", allParties); // Check if the array has data
  const input = document.getElementById("partySearch");
  const query = input.value.toLowerCase();
  console.log("Search query:", query); // Log the search query

  const filtered = allParties.filter(party =>
    party.name.toLowerCase().includes(query) ||
    party.phone.toLowerCase().includes(query) ||
    party.email.toLowerCase().includes(query) ||
    party.type.toLowerCase().includes(query) ||
    party.address.toLowerCase().includes(query)
  );

  console.log("Filtered parties:", filtered); // Log the filtered results
  renderPartyList(filtered);
}



function renderPartyList(parties) {
  console.log("Rendering parties:", parties); // Log the parties that will be displayed
  const partyList = document.getElementById("partyList");
  partyList.innerHTML = "";

  parties.forEach(party => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${party.name}</td>
      <td>${party.type}</td>
      <td>${party.phone}</td>
      <td>${party.email}</td>
      <td>${party.address}</td>
      <td>${party.blocked ? "Blocked" : "Active"}</td>
      <td>
        <button onclick="showUpdateForm(${party.id}, '${party.name}', '${party.type}', '${party.phone}', '${party.email}', '${party.address}', ${party.blocked})" id="editBtn">Edit (Alt+E)</button>
      </td>
    `;
    partyList.appendChild(row);
  });

  // Re-attach delete listeners
  partyList.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteParty(id);
    });
  });
}


document.addEventListener("DOMContentLoaded", function () {
enableArrowKeyNavigation();
const form = document.getElementById("partyForm");
  if (form) {
    form.querySelector("input[name='name']")?.focus();
    enableKeyboardFormNavigation(form);
  }
  const firstInput = document.querySelector("#partyForm input[name='name']");
  if (firstInput) {
    firstInput.focus();
  }
});

// Load parties when the page loads
if (document.getElementById("partyList")) {
  fetchParties();
}




function enableArrowKeyNavigation() {
  document.addEventListener("keydown", function (e) {
      const active = document.activeElement;
      const tag = active.tagName.toLowerCase();

      const isFormInput = ["input", "select", "textarea"].includes(tag);
      const isFocusable = ["input", "select", "textarea", "button", "a"].includes(tag);

      // 🔁 Inside a form: Enter and Arrow navigation
      if (isFormInput && active.form) {
        const fields = Array.from(active.form.querySelectorAll("input, select, textarea"))
          .filter(el => !el.disabled && el.type !== "hidden");

        const index = fields.indexOf(active);

        if (e.key === "Enter") {
          e.preventDefault();
          if (index < fields.length - 1) {
            fields[index + 1].focus();
          } else {
            active.form.requestSubmit(); // last field → submit
          }
        }

        if (e.key === "ArrowDown" && index < fields.length - 1) {
          e.preventDefault();
          fields[index + 1].focus();
        }

        if (e.key === "ArrowUp" && index > 0) {
          e.preventDefault();
          fields[index - 1].focus();
        }
      }

      // 🌐 Global arrow key focus movement
      if (isFocusable) {
        const all = Array.from(document.querySelectorAll("input, button, select, a, textarea"))
          .filter(el => !el.disabled && el.offsetParent !== null); // skip hidden ones
        const currentIndex = all.indexOf(active);

        if (e.key === "ArrowRight" && currentIndex < all.length - 1) {
          e.preventDefault();
          all[currentIndex + 1].focus();
        }

        if (e.key === "ArrowLeft" && currentIndex > 0) {
          e.preventDefault();
          all[currentIndex - 1].focus();
        }
      }
    });
}

//document.addEventListener("keydown", function (e) {
//  if (e.key === "Enter") {
//    const activeElement = document.activeElement;
//    const tag = activeElement.tagName.toLowerCase();
//
//    if (tag === "input" || tag === "select") {
//      e.preventDefault();
//      const form = activeElement.form;
//      const elements = Array.from(form.querySelectorAll("input, select, textarea"))
//                            .filter(el => !el.disabled && el.type !== "hidden");
//
//      const index = elements.indexOf(activeElement);
//      if (index > -1 && index < elements.length - 1) {
//        elements[index + 1].focus();
//      } else {
//        form.requestSubmit(); // Last field → submit
//      }
//    }
//  }
//});
//
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
//
//
//
//
//document.addEventListener("keydown", function (e) {
//  const activeElement = document.activeElement;
//  const tag = activeElement.tagName.toLowerCase();
//
//  if (tag === "input") {
//    const form = activeElement.form;
//    const elements = Array.from(form.querySelectorAll("input, select, textarea"))
//                          .filter(el => !el.disabled && el.type !== "hidden");
//    const index = elements.indexOf(activeElement);
//
//    if (e.key === "ArrowDown" && index < elements.length - 1) {
//      e.preventDefault();
//      elements[index + 1].focus();
//    }
//
//    if (e.key === "ArrowUp" && index > 0) {
//      e.preventDefault();
//      elements[index - 1].focus();
//    }
//  }
//});
//
//

function enableKeyboardFormNavigation(form) {
  if (!form) return;

  const focusable = Array.from(form.querySelectorAll("input, select, textarea"))
    .filter(el => !el.disabled && el.type !== "hidden");

  form.addEventListener("keydown", function (e) {
    const activeElement = document.activeElement;

    if (!focusable.includes(activeElement)) return;

    const index = focusable.indexOf(activeElement);

    if (e.key === "Enter") {
      e.preventDefault();
      if (index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else {
        form.requestSubmit();
      }
    }

    if (e.key === "ArrowDown" && index < focusable.length - 1) {
      e.preventDefault();
      focusable[index + 1].focus();
    }

    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      focusable[index - 1].focus();
    }
  });
}




document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("submitBtn")?.click();
}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }

if(e.altKey && e.key.toLowerCase()==='c'){
e.preventDefault();
document.getElementById("type")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='e'){
e.preventDefault();
document.getElementById("editBtn")?.click();
}

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("partySearch")?.focus();
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
