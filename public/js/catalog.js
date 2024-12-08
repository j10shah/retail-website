function addToCart(event) {
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

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const notification = document.getElementById("notification");
  notification.textContent = `${product.name} added to cart!`;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 3000);
}
