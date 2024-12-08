function loadCheckoutSummary() {
  const orderSummaryContainer = document.getElementById("order-summary");
  const totalPriceElement = document.getElementById("total-price");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart data for checkout:", cart);

  if (cart.length === 0) {
    orderSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "Total: $0.00";
    return;
  }

  let totalPrice = 0;
  orderSummaryContainer.innerHTML = "";

  cart.forEach((item) => {
    if (item && item.name && !isNaN(item.price)) {
      const quantity = item.quantity || 1; // Default quantity to 1 if missing
      const itemElement = document.createElement("div");
      itemElement.className = "order-item";
      itemElement.innerHTML = `<p>${item.name} - $${item.price.toFixed(
        2
      )} x ${quantity}</p>`;
      orderSummaryContainer.appendChild(itemElement);
      totalPrice += item.price * quantity;
    } else {
      console.warn("Invalid cart item data:", item);
    }
  });

  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  if (!paymentMethod) {
    alert("Please select a payment method.");
    console.log("No payment method selected.");
    return;
  }

  alert(
    `Order placed successfully using ${paymentMethod.value}. Thank you for shopping with Exclusive!`
  );

  localStorage.removeItem("cart");
  console.log("Cart cleared, redirecting...");

  window.location.href = "index.html";
});

document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", (e) => {
    const cardDetails = document.querySelector(".card-details");

    // Ensure the card details are only shown for "credit-card" option
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
  });
});

window.onload = loadCheckoutSummary;
