// Variables globales
var turno; // Jugador actual
var tablero; // Matriz del tablero de juego
var numerosDisponibles; // Números disponibles para jugar
var canvas; // Elemento canvas
var ctx; // Contexto del canvas
var celdaSize = 80; // Tamaño de las celdas en el tablero
var numeroSeleccionado = null; // Número seleccionado por el jugador

// Función para inicializar el juego
function iniciarJuego() {
  // Verificar si hay datos de los jugadores en sessionStorage
  var player1 = sessionStorage.getItem("player1");
  var player2 = sessionStorage.getItem("player2");
  if (player1 == null || player1 == "" || player2 == null || player2 == "") {
    // No hay datos de los jugadores, redirigir a index.html
    window.location.href = 'index.html';
    return;
  }

  // Verificar si hay datos de la partida en sessionStorage
  var partida = sessionStorage.getItem('partida');
  if (partida) {
    console.log("Carga partida");
    // Hay datos de la partida, mostrar el estado actual
    cargarEstadoPartida();
  } else {
    console.log("Inicia partida");
    // No hay datos de la partida, iniciar una nueva partida
    iniciarNuevaPartida();
  }
}

// Función para cargar el estado de la partida
function cargarEstadoPartida() {
  // Obtener datos de la partida de sessionStorage
  var partida = JSON.parse(sessionStorage.getItem('partida'));
  turno = partida.turno;
  tablero = partida.tablero;
  numerosDisponibles = partida.numerosDisponibles;

  // Actualizar el marcador del juego
  actualizarMarcador();

  // Mostrar el tablero de juego
  dibujarTablero();

  // Mostrar los números disponibles
  mostrarNumerosDisponibles();
}

// Función para iniciar una nueva partida
function iniciarNuevaPartida() {
  console.log("Intenta obtener el tablero");
  // Realizar la petición ajax/fetch para obtener un tablero aleatorio
  obtenerTableroAleatorio()
    .then(function (data) {
      console.log("Ha obtenido el tablero");
      // Guardar el tablero en la variable global
      tablero = data.tablero;
      // Generar los números disponibles aleatoriamente
      generarNumerosDisponibles();

      // Elegir aleatoriamente el turno del jugador que comienza a jugar
      turno = Math.random() < 0.5 ? 'Jugador 1' : 'Jugador 2';

      // Mostrar mensaje modal indicando el turno
      mostrarMensajeModal('Es el turno del ' + turno);

      // Guardar la información de la partida en sessionStorage
      guardarEstadoPartida();

      // Actualizar el marcador del juego
      actualizarMarcador();

      // Mostrar el tablero de juego
      dibujarTablero();

      // Mostrar los números disponibles
      mostrarNumerosDisponibles();
    })
    .catch(function (error) {
      console.log('Error al obtener el tablero: ', error);
    });
}

// Función para obtener un tablero aleatorio
function obtenerTableroAleatorio() {
  return new Promise(function (resolve, reject) {
    // Realizar la petición ajax/fetch para obtener el tablero
    // Obtener el tablero de juego
    console.log("Antes de hacer el ajax fetch");
    fetch('api/get/tablero.php')
      .then(response => response.json())
      .then(data => {
      if (data.RESULTADO === 'OK') {
          console.log("Resultado ok");
          const tablero = data.TABLERO;
          // Aquí puedes manejar la respuesta del servidor, por ejemplo, guardar el tablero en sessionStorage
          sessionStorage.setItem('tablero', JSON.stringify(tablero));

          // Continuar con el flujo del juego, por ejemplo, mostrar el tablero y los números disponibles
          mostrarTablero(tablero);
          mostrarNumerosDisponibles();
      } else {
          console.log("Resultado false");
          // Manejar el caso de error
          console.error('Error al obtener el tablero:', data.DESCRIPCION);
      }
    })
    .catch(error => {
    console.error('Error en la petición:', error);
    });
  });
}

// Función para generar los números disponibles aleatoriamente
function generarNumerosDisponibles() {
  // Generar tres números aleatorios entre 1 y 9 (excluyendo el 5)
  var numeros = [];
  while (numeros.length < 3) {
    var num = Math.floor(Math.random() * 9) + 1;
    if (num !== 5 && !numeros.includes(num)) {
      numeros.push(num);
    }
  }

  // Guardar los números disponibles en la variable global
  numerosDisponibles = numeros;
}

// Función para guardar el estado de la partida en sessionStorage
function guardarEstadoPartida() {
  // Crear el objeto con la información de la partida
  var partida = {
    turno: turno,
    tablero: tablero,
    numerosDisponibles: numerosDisponibles
  };

  // Guardar la partida en sessionStorage
  sessionStorage.setItem('partida', JSON.stringify(partida));
}

// Función para actualizar el marcador del juego
function actualizarMarcador() {
  // Obtener los datos de los jugadores de sessionStorage
  var player1 = JSON.parse(sessionStorage.getItem("player1"));
  var player2 = JSON.parse(sessionStorage.getItem("player2"));
  
  // Obtener los elementos del marcador
  var player1Nombre = document.getElementById('player1Nombre');
  var player1Puntos = document.getElementById('player1Puntos');
  var player2Nombre = document.getElementById('player2Nombre');
  var player2Puntos = document.getElementById('player2Puntos');

  // Actualizar los nombres y puntuaciones de los jugadores
  player1Nombre.textContent = player1.nombre;
  player1Puntos.textContent = player1.puntos;
  player2Nombre.textContent = player2.nombre;
  player2Puntos.textContent = player2.puntos;

  // Destacar el jugador actual en el marcador
  if (turno === "player1") {
    player1Nombre.classList.add('turno-destacado');
    player2Nombre.classList.remove('turno-destacado');
  } else {
    player1Nombre.classList.remove('turno-destacado');
    player2Nombre.classList.add('turno-destacado');
  }
}

// Función para dibujar el tablero de juego
function dibujarTablero() {
  // Obtener el canvas y su contexto
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar las celdas del tablero
  for (var fila = 0; fila < tablero.length; fila++) {
    for (var col = 0; col < tablero[fila].length; col++) {
      var x = col * celdaSize;
      var y = fila * celdaSize;
      var celda = tablero[fila][col];

      // Dibujar la celda
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, celdaSize, celdaSize);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, celdaSize, celdaSize);

      // Dibujar el número en la celda si existe
      if (celda !== 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(celda, x + celdaSize / 2, y + celdaSize / 2);
      }
    }
  }
}

// Función para mostrar los números disponibles
function mostrarNumerosDisponibles() {
  // Obtener el elemento de números disponibles
  var numerosDisponiblesElem = document.getElementById('numerosDisponibles');
  numerosDisponiblesElem.innerHTML = '';

  // Mostrar los números disponibles
  for (var i = 0; i < numerosDisponibles.length; i++) {
    var num = numerosDisponibles[i];
    var numElem = document.createElement('div');
    numElem.textContent = num;
    numElem.classList.add('numero-disponible');

    // Destacar el número disponible seleccionado
    if (num === numeroSeleccionado) {
      numElem.classList.add('seleccionado');
    }

    // Agregar evento de clic al número disponible
    numElem.addEventListener('click', function () {
      seleccionarNumeroDisponible(num);
    });

    numerosDisponiblesElem.appendChild(numElem);
  }
}

// Función para seleccionar un número disponible
function seleccionarNumeroDisponible(num) {
  // Verificar si el número ya está seleccionado
  if (numeroSeleccionado === num) {
    numeroSeleccionado = null;
  } else {
    numeroSeleccionado = num;
  }

  // Actualizar los números disponibles
  mostrarNumerosDisponibles();
}

// Función para manejar el clic en el tablero de juego
function handleClickTablero(event) {
  // Obtener las coordenadas del clic
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  // Obtener la posición de la celda en la matriz del tablero
  var fila = Math.floor(y / celdaSize);
  var col = Math.floor(x / celdaSize);

  // Verificar si la celda es jugable
  if (esCeldaJugable(fila, col)) {
    // Colocar el número en la celda
    colocarNumeroEnCelda(fila, col);

    // Comprobar si se han obtenido múltiplos de 5
    comprobarMultiplosDe5();

    // Actualizar el marcador del juego
    actualizarMarcador();

    // Verificar si hay fin de juego
    if (esFinDeJuego()) {
      // Mostrar mensaje de fin de juego
      mostrarMensajeModal('Fin de juego');

      // Reiniciar el juego después de 2 segundos
      setTimeout(function () {
        reiniciarJuego();
      }, 2000);
    } else {
      // Cambiar el turno al otro jugador
      cambiarTurno();
    }
  }
}

// Función para verificar si una celda es jugable
function esCeldaJugable(fila, col) {
  // Verificar si la celda está dentro de los límites del tablero
  if (fila < 0 || fila >= tablero.length || col < 0 || col >= tablero[0].length) {
    return false;
  }

  // Verificar si la celda está vacía
  if (tablero[fila][col] !== 0) {
    return false;
  }

  return true;
}

// Función para colocar un número en una celda del tablero
function colocarNumeroEnCelda(fila, col) {
  // Verificar si hay un número disponible seleccionado
  if (numeroSeleccionado !== null) {
    // Eliminar el número de los números disponibles
    var index = numerosDisponibles.indexOf(numeroSeleccionado);
    if (index !== -1) {
      numerosDisponibles.splice(index, 1);
    }

    // Colocar el número en la celda
    tablero[fila][col] = numeroSeleccionado;

    // Guardar el estado de la partida
    guardarEstadoPartida();

    // Realizar la petición ajax/fetch para comprobar los múltiplos de 5
    comprobarMultiplosDe5()
      .then(function (multiplos) {
        if (multiplos.length > 0) {
          // Se han obtenido múltiplos de 5
          // Sumar los valores de las celdas indicadas en el array de múltiplos
          var puntos = 0;
          for (var i = 0; i < multiplos.length; i++) {
            var fila = multiplos[i].fila;
            var col = multiplos[i].col;
            puntos += tablero[fila][col];

            // Limpiar la posición en la matriz del tablero
            tablero[fila][col] = 0;
          }

          // Actualizar la puntuación del jugador
          var player1 = JSON.parse(sessionStorage.getItem("player1"));
          var player2 = JSON.parse(sessionStorage.getItem("player2"));
          if (turno === 'Jugador 1') {
            player1.puntos += puntos;
          } else {
            player2.puntos += puntos;
          }
          sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
        }

        // Repintar el tablero de juego
        dibujarTablero();

        // Comprobar si hay fin de juego
        if (esFinDeJuego()) {
          // Mostrar mensaje de fin de juego
          mostrarMensajeModal('Fin de juego');

          // Reiniciar el juego después de 2 segundos
          setTimeout(function () {
            reiniciarJuego();
          }, 2000);
        } else {
          // Cambiar el turno al otro jugador
          cambiarTurno();
        }
      })
      .catch(function (error) {
        console.log('Error al comprobar múltiplos de 5: ', error);
      });
  }
}

// Función para comprobar los múltiplos de 5
function comprobarMultiplosDe5() {
  return new Promise(function (resolve, reject) {
    // Realizar la petición ajax/fetch para comprobar los múltiplos de 5
    fetch('api/post/comprobar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(matrizTablero)
    })
        .then(response => response.json())
        .then(data => {
          if (data.RESULTADO === 'OK') {
            const celdasSuma = data.CELDAS_SUMA;
            const jugables = data.JUGABLES;
      
            // Aquí puedes manejar la respuesta del servidor, por ejemplo, obtener las posiciones de los múltiplos de 5
            var multiplos = celdasSuma.map(posicion => JSON.parse(posicion));
      
            // Continuar con el flujo del juego, por ejemplo, mostrar los múltiplos de 5 y actualizar las puntuaciones
            mostrarMultiplosDe5(multiplos);
            actualizarPuntuaciones(respuesta.puntos);
      
            // Verificar si hay fin de juego
            if (esFinDeJuego()) {
              finalizarJuego();
            } else {
              cambiarTurno();
            }
          } else {
            // Manejar el caso de error
            console.error('Error al comprobar los múltiplos de 5:', data.DESCRIPCION);
          }
        })
        .catch(error => {
          console.error('Error en la petición:', error);
        });
  });
}

// Función para cambiar el turno al otro jugador
function cambiarTurno() {
  // Cambiar el turno al otro jugador
  turno = turno === 'Jugador 1' ? 'Jugador 2' : 'Jugador 1';

  // Guardar el estado de la partida
  guardarEstadoPartida();

  // Mostrar mensaje modal indicando el turno
  mostrarMensajeModal('Es el turno del ' + turno);
}

// Función para reiniciar el juego
function reiniciarJuego() {
  // Eliminar los datos de la partida en sessionStorage
  sessionStorage.removeItem('partida');

  // Reiniciar el juego
  iniciarNuevaPartida();
}

// Función para mostrar un mensaje modal
function mostrarMensajeModal(mensaje) {
  // Obtener el elemento del mensaje modal
  var mensajeModal = document.getElementById('mensajeModal');
  mensajeModal.textContent = mensaje;

  // Mostrar el mensaje modal
  mensajeModal.style.display = 'block';

  // Ocultar el mensaje modal después de 2 segundos
  setTimeout(function () {
    mensajeModal.style.display = 'none';
  }, 2000);
}

// Evento de carga de la página
window.addEventListener('load', function () {
  // Inicializar el juego
  iniciarJuego();

  // Agregar el evento de clic al tablero de juego
  canvas.addEventListener('click', handleClickTablero);
});

// Función para comprobar si hay fin de juego
function esFinDeJuego() {
  var partida = JSON.parse(sessionStorage.getItem('partida'));
  if (partida === null || partida.multiplos === undefined) {
    // Manejar el caso cuando no se encuentra la partida en el sessionStorage
    return false;
  }

  var multiplos = partida.multiplos;
  
  // Comprobar si no quedan celdas jugables y no se han obtenido múltiplos de 5
  if (partida.celdasJugables === 0 && multiplos.length === 0) {
    return true;
  } else {
    return false;
  }
}
  
// Función para finalizar el juego
function finalizarJuego() {
    // Obtener la información de la partida y los jugadores
    var partida = JSON.parse(sessionStorage.getItem('partida'));
    var player1 = JSON.parse(sessionStorage.getItem("player1"));
    var player2 = JSON.parse(sessionStorage.getItem("player2"));
  
    // Obtener las puntuaciones de los jugadores
    var puntuacionplayer1 = player1.puntos;
    var puntuacionplayer2 = player2.puntos;
  
    // Obtener el nombre del ganador
    var ganador = puntuacionplayer1 > puntuacionplayer2 ? 'Jugador 1' : 'Jugador 2';
  
    // Mostrar mensaje modal con los resultados
    var mensaje = 'Fin de juego\n\nGanador: ' + ganador + '\n\nPuntuación:\nJugador 1: ' + puntuacionplayer1 + '\nJugador 2: ' + puntuacionplayer2;
    mostrarMensajeModal(mensaje);
  
    // Guardar las puntuaciones en la lista de puntuaciones
    var puntuaciones = JSON.parse(localStorage.getItem('puntuaciones')) || [];
    var nuevaPuntuacion = {
      jugador: ganador,
      puntuacion: puntuacionplayer1 > puntuacionplayer2 ? puntuacionplayer1 : puntuacionplayer2
    };
    puntuaciones.push(nuevaPuntuacion);
    puntuaciones.sort(function (a, b) {
      return b.puntuacion - a.puntuacion;
    });
    puntuaciones = puntuaciones.slice(0, 10);
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
  
    // Reiniciar el juego después de 2 segundos
    setTimeout(function () {
      reiniciarJuego();
    }, 2000);
}
  
// Dentro de la función comprobarMultiplosDe5(), después de repintar el tablero:
// ...
if (esFinDeJuego()) {
    finalizarJuego();
} else {
    cambiarTurno();
}
// ...
  
// Evento de clic en el botón Aceptar del mensaje modal
var btnAceptar = document.getElementById('btnAceptar');
btnAceptar.addEventListener('click', function () {
    // Cerrar el mensaje modal
    mensajeModal.style.display = 'none';
  
    // Reiniciar el juego
    reiniciarJuego();
});  