document.getElementById("loginButton").addEventListener("click", function () {
  // Logic for form validation or processing can be added here
  document.getElementById("loginForm").action = "index.html";
  document.getElementById("loginForm").submit();
});
