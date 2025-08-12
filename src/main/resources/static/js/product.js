let allProducts = []; // Store all products for filtering

document.getElementById("searchInput")?.addEventListener("input", searchProducts);

document.getElementById("productForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
  };

  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("✅ Product added successfully!");
      form.reset();
    } else {
      const result = await response.json();
      alert("❌ Failed to add product: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Server error.");
  }
});

// Escape HTML to prevent breaking inline event handlers
function escapeHTML(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, "\\\"");
}

// Fetch and display products
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    console.log("Response status:", response.status); // Debug response status
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const products = await response.json();
    console.log("Products:", products); // Debug fetched data
    const productList = document.getElementById("productList");
    if (productList) {
      productList.innerHTML = "";
      if (products.length === 0) {
        productList.innerHTML = "<tr><td colspan='5'>No products found.</td></tr>";
      } else {
        products.forEach(product => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
              <button onclick="showUpdateForm(${product.id}, '${escapeHTML(product.name)}', '${escapeHTML(product.description)}', ${product.price}, ${product.party ? product.party.id : null})">Edit</button>

            </td>
          `;
          productList.appendChild(row);
        });
      }
    }
    allProducts = products; // ✅ Store for search filtering
    renderProducts(allProducts); // ✅ Use consistent renderer
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Failed to load products. Check console for details.");
  }
}



// Render products to the table
function renderProducts(products) {
  const productList = document.getElementById("productList");
  if (productList) {
    productList.innerHTML = "";
    if (products.length === 0) {
      productList.innerHTML = "<tr><td colspan='5'>No products found.</td></tr>";
    } else {
      products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>
            <button onclick="showUpdateForm(${product.id}, '${escapeHTML(product.name)}', '${escapeHTML(product.description)}', ${product.price}, ${product.party ? product.party.id : null})" id="editBtn">Edit (Alt+E)</button>
          </td>
        `;
        productList.appendChild(row);
      });
    }
  }
}

// Search products
function searchProducts() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase();
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );
  renderProducts(filteredProducts);
}



// Show update form
function showUpdateForm(id, name, description, price, partyId) {
  const formContainer = document.getElementById("updateFormContainer");
  if (formContainer) {
    formContainer.innerHTML = `
      <h3>Update Product</h3>
      <form id="updateProductForm">
        <input type="hidden" name="id" value="${id}">
        <label>Name:</label>
        <input type="text" name="name" value="${name}" required><br>
        <label>Description:</label>
        <input type="text" name="description" value="${description}" required><br>
        <label>Price:</label>
        <input type="number" name="price" value="${price}" step="0.01" required><br>
        <button type="submit">Update</button>
      </form>
    `;

    formContainer.querySelector("input[name='name']")?.focus(); // autofocus
    enableArrowKeyNavigation();

    document.getElementById("updateProductForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        id: form.id.value,
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value)
      };
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          alert("✅ Product updated successfully!");
          formContainer.innerHTML = "";
          fetchProducts();
        } else {
          alert("❌ Failed to update product.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("⚠️ Server error.");
      }
    });
  }
}

// Delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        alert("✅ Product deleted successfully!");
        fetchProducts(); // Refresh product list after delete
      } else {
        alert("❌ Failed to delete product.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server error.");
    }
  }
}

// Load products when the page loads
document.addEventListener("DOMContentLoaded", () => {
enableArrowKeyNavigation();
    const nameInput = document.querySelector("#productForm input[name='name']");
  if (nameInput) {
    nameInput.focus();
  }

  if (document.getElementById("productList")) {
    fetchProducts();
  }
});


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
//
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





document.addEventListener("keydown", function(e){

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("submitProduct")?.click();
}

if(e.key === "Escape"){
  e.preventDefault();
  document.getElementById("homePage")?.click();
  }

if(e.altKey && e.key.toLowerCase()==='s'){
e.preventDefault();
document.getElementById("searchInput")?.focus();
}

if(e.altKey && e.key.toLowerCase()==='e'){
e.preventDefault();
document.getElementById("editBtn")?.click();
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
