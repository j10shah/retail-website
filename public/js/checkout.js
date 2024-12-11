function loadCheckoutSummary() {
  const orderSummaryContainer = document.getElementById("order-summary");
  const totalPriceElement = document.getElementById("total-price");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart data for checkout:", cart);

  // Handle empty cart scenario
  if (cart.length === 0) {
    orderSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "Total: $0.00";
    return;
  }

  let totalPrice = 0;
  orderSummaryContainer.innerHTML = ""; // Clear previous summary if any

  // Loop through cart and add items to order summary
  cart.forEach((item) => {
    if (item && item.name && !isNaN(item.price)) {
      const quantity = item.quantity || 1; // Default to 1 if quantity is missing
      const itemElement = document.createElement("div");
      itemElement.className = "order-item";
      itemElement.innerHTML = `<p>${item.name} - $${item.price.toFixed(2)} x ${quantity}</p>`;
      orderSummaryContainer.appendChild(itemElement);
      totalPrice += item.price * quantity; // Add the price for this item to the total
    } else {
      console.warn("Invalid cart item data:", item);
    }
  });

  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

  // Optionally show the PayPal button if it's selected as payment method
  const paypalButtonContainer = document.getElementById('paypal-button-container');
  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  
  // If PayPal is selected, render the PayPal button
  if (paymentMethod && paymentMethod.value === 'paypal') {
    paypalButtonContainer.classList.remove("hidden");
  } else {
    paypalButtonContainer.classList.add("hidden");
  }
}

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  if (!paymentMethod) {
    alert("Please select a payment method.");
    console.log("No payment method selected.");
    return;
  }

  if (paymentMethod.value === "paypal") {
    alert("You will be redirected to PayPal for payment.");
  } else {
    alert(
      `Order placed successfully using ${paymentMethod.value}. Thank you for shopping with Exclusive!`
    );
  }

  localStorage.removeItem("cart"); // Clear cart after order
  console.log("Cart cleared, redirecting...");

  window.location.href = "index.html"; // Redirect to homepage after order
});

// Handle dynamic display of card details based on payment method selected
document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", (e) => {
    const cardDetails = document.querySelector(".card-details");

    // Show card details input if credit card is selected
    if (e.target.value === "credit-card") {
      cardDetails.classList.remove("hidden");
      cardDetails.querySelectorAll("input").forEach((input) => {
        input.required = true; // Make card inputs required
      });
    } else {
      cardDetails.classList.add("hidden");
      cardDetails.querySelectorAll("input").forEach((input) => {
        input.required = false; // Remove required attribute for card inputs
      });
    }
    
    // Show PayPal button if PayPal is selected
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    if (e.target.value === "paypal") {
      paypalButtonContainer.classList.remove("hidden");
    } else {
      paypalButtonContainer.classList.add("hidden");
    }
  });
});

window.onload = loadCheckoutSummary;
