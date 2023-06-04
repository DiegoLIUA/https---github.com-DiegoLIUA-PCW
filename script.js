// Comprobar si se está jugando una partida al cargar la página
window.addEventListener('load', function() {
    // Obtener información de la partida almacenada en sessionStorage
    const gameState = sessionStorage.getItem('gameState');
    
    if (gameState) {
      // Redireccionar a la página del juego
      //window.location.href = 'juego.html';
    }
  });
  
  // Comprobar si se están ingresando los nombres de los jugadores al cargar la página
  window.addEventListener('load', function() {
    // Obtener datos de los jugadores desde sessionStorage
    const player1 = sessionStorage.getItem('player1');
    const player2 = sessionStorage.getItem('player2');
  
    if (!player1 || !player2) {
      // Si no hay datos de los jugadores, redirigir a index.html
      //window.location.href = 'index.html';
    } else {
      // Obtener datos de la partida desde sessionStorage
      const gameState = sessionStorage.getItem('gameState');
  
      if (gameState) {
        // Mostrar el estado de la partida (tablero, marcador, números disponibles)
        // ...
      } else {
        // Iniciar una nueva partida y guardar los datos en sessionStorage
        // ...
      }
    }
  });
  
  // Obtener las puntuaciones almacenadas en sessionStorage
  function getScores() {
    const scores = JSON.parse(sessionStorage.getItem('scores'));
    return scores ? scores : [];
  }
  
  // Mostrar la tabla de puntuaciones
  function displayScores() {
    const scores = getScores();
    const tableBody = document.querySelector('#score-table tbody');
  
    // Limpiar el contenido de la tabla
    tableBody.innerHTML = '';
  
    if (scores.length === 0) {
      // Mostrar mensaje cuando no hay puntuaciones almacenadas
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.textContent = 'Todavía no hay puntuaciones guardadas. ¡¡¡ Sé el primero en conseguir una puntuación máxima !!!';
      emptyCell.setAttribute('colspan', '3');
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
    } else {
      // Mostrar las puntuaciones almacenadas
      scores.forEach(function(score, index) {
        const row = document.createElement('tr');
        const positionCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');
  
        positionCell.textContent = index + 1;
        nameCell.textContent = score.name;
        scoreCell.textContent = score.score;
  
        row.appendChild(positionCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
  
        tableBody.appendChild(row);
      });
    }
  }
  
  // Actualizar la tabla de puntuaciones al cargar la página
  window.addEventListener('load', function() {
    displayScores();
  });
  
  // Obtener información de la partida almacenada en sessionStorage
  function getGameState() {
    const gameState = JSON.parse(sessionStorage.getItem('gameState'));
    return gameState ? gameState : null;
  }
  
  // Guardar la información de la partida en sessionStorage
  function saveGameState(gameState) {
    sessionStorage.setItem('gameState', JSON.stringify(gameState));
  }
  
  // Obtener los nombres de los jugadores del formulario
  function getPlayerNames() {
    const player1 = document.getElementById('player1').value.trim();
    const player2 = document.getElementById('player2').value.trim();
  
    return {
      player1,
      player2
    };
  }
  
  // Validar el formulario de identificación de jugadores
  function validateForm() {
    const { player1, player2 } = getPlayerNames();
  
    if (player1 === '' || player2 === '') {
      alert('Por favor, ingrese los nombres de los dos jugadores.');
      return false;
    }
  
    return true;
  }
  
  // Controlar el envío del formulario
  document.getElementById('game-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    if (validateForm()) {
      const { player1, player2 } = getPlayerNames();
      // Guardar los nombres de los jugadores en sessionStorage o cualquier otro manejo necesario
      sessionStorage.setItem('player1', player1);
      sessionStorage.setItem('player2', player2);
      // Redireccionar a la página del juego
      window.location.href = 'juego.html';
    }
  });
  
  // Controlar el evento de limpiar campos del formulario
  document.getElementById('reset-button').addEventListener('click', function() {
    document.getElementById('player1').value = '';
    document.getElementById('player2').value = '';
  });
  
  // Controlar el evento de terminar partida
  document.getElementById('end-game-button').addEventListener('click', function() {
    // Limpiar los datos de la partida en sessionStorage
    sessionStorage.removeItem('gameState');
    // Redireccionar a la página inicial
    window.location.href = 'index.html';
  });
  
  // Controlar el evento de mostrar ayuda
  document.getElementById('help-button').addEventListener('click', function() {
    // Mostrar el modal de ayuda
    document.getElementById('help-modal').style.display = 'block';
  });
  
  // Controlar el evento de cerrar el modal de ayuda
  document.getElementById('close-help-button').addEventListener('click', function() {
    // Ocultar el modal de ayuda
    document.getElementById('help-modal').style.display = 'none';
  });
  