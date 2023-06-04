document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("game-form");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const player1 = document.getElementById("player1").value;
      const player2 = document.getElementById("player2").value;
  
      if (player1 && player2) {
        sessionStorage.setItem("player1", player1);
        sessionStorage.setItem("player2", player2);
        window.location.href = "juego.html";
      }
    });
  });
  