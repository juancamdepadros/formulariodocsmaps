document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("mensaje").textContent = "¡Gracias por unirte!";
    document.getElementById("mensaje").style.display = "block";
});