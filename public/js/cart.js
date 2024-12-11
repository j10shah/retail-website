// Function to load and display cart items
function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  // Retrieve cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Retrieved cart data:", cart); // Debug log

  // Remove duplicate items in the cart (if any)
  const uniqueCart = [];
  const itemIds = new Set();
  cart.forEach((item) => {
    if (!itemIds.has(item.id)) {
      uniqueCart.push(item);
      itemIds.add(item.id);
    }
  });

  if (uniqueCart.length !== cart.length) {
    console.warn("Duplicate items detected. Cleaning up...");
    cart = uniqueCart;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

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

// Function to add an item to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    console.log(`Product ${product.id} already in cart. Updating quantity.`);
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Added product to cart:", product); // Debug log
  loadCart(); // Reload cart

  // Show notification
  showNotification(`${product.name} added to cart!`);
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
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length > 0) {
    window.location.href = "checkout.html";
  } else {
    alert("Your cart is empty.");
  }
}

// Set up add-to-cart buttons
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");

      if (!productCard) {
        console.error("Product card not found!");
        return;
      }

      const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        quantity: 1,
      };

      if (product.id && product.name && !isNaN(product.price)) {
        addToCart(product);
      } else {
        console.error("Invalid product data:", product);
      }
    });
  });
}

// Function to show a notification
function showNotification(message) {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4caf50";
    notification.style.color = "#fff";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    notification.style.zIndex = "1000";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Load cart on page load
window.onload = () => {
  loadCart();
  setupAddToCartButtons();
};
