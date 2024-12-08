// Function to add products to the cart
function addToCart(event) {
  const productCard = event.target.closest(".product-card");

  if (!productCard) {
    console.error("Product card not found!");
    return;
  }

  // Retrieve product details from data attributes
  const product = {
    id: productCard.dataset.id,
    name: productCard.dataset.name,
    price: parseFloat(productCard.dataset.price),
    quantity: 1,
  };

  console.log("Adding product to cart:", product);

  // Retrieve existing cart or initialize an empty one
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex >= 0) {
    // If product exists, increase quantity
    cart[existingProductIndex].quantity += 1;
  } else {
    // If product doesn't exist, add to cart
    cart.push(product);
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Display notification
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = `${product.name} has been added to your cart!`;
    notification.style.display = "block";

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }
}

// Function to load and display cart items
function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  // Retrieve cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart data retrieved:", cart); // Debug log

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "Total: $0.00";
    return;
  }

  let totalPrice = 0;
  cartItemsContainer.innerHTML = ""; // Clear previous items

  cart.forEach((item, index) => {
    if (item && item.name && !isNaN(item.price)) {
      console.log("Item being added to display:", item); // Debug log
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
          `;
      cartItemsContainer.appendChild(itemElement);
      totalPrice += item.price * item.quantity; // Adjust calculation for quantity
    } else {
      console.warn("Invalid item data:", item); // Debug warning if item data is incomplete
    }
  });

  // Update total price
  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove item at index
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Item removed from cart at index:", index); // Debug log
  loadCart(); // Reload cart
}

// Function to proceed to checkout
function goToCheckout() {
  if (JSON.parse(localStorage.getItem("cart"))?.length > 0) {
    window.location.href = "checkout.html";
  } else {
    alert(
      "Your cart is empty. Please add items before proceeding to checkout."
    );
  }
}

// Load cart items when the page loads (on cart.html)
if (document.getElementById("cart-items")) {
  window.onload = loadCart;
}

// Add event listeners for 'Add to Cart' buttons dynamically
document
  .querySelectorAll("button[onclick='addToCart(event)']")
  .forEach((button) => {
    button.addEventListener("click", addToCart);
  });
