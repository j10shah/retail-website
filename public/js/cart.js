// Function to load and display cart items
function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  // Retrieve cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Retrieved cart data:", cart); // Debug log

  // Check if cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "Total: $0.00";
    return;
  }

  let totalPrice = 0;
  cartItemsContainer.innerHTML = ""; // Clear previous content

  cart.forEach((item) => {
    if (item && item.name && !isNaN(item.price)) {
      // Create a new div for each cart item
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
        <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
        <button class="remove-btn" onclick="removeFromCart('${
          item.id
        }')">Remove</button>
      `;
      cartItemsContainer.appendChild(itemElement);

      // Calculate total price
      totalPrice += item.price * item.quantity;
    } else {
      console.warn("Invalid cart item:", item); // Debug warning
    }
  });

  // Update total price
  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId); // Remove by id
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(`Removed product with ID: ${productId}`); // Debug log
  loadCart(); // Reload cart
}

// Function to proceed to checkout
function goToCheckout() {
  if (JSON.parse(localStorage.getItem("cart"))?.length > 0) {
    window.location.href = "checkout.html";
  } else {
    alert("Your cart is empty.");
  }
}

// Load cart on page load
window.onload = loadCart;
