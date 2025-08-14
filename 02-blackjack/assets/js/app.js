const initBlackjack = () => {
  "use strict"; // Modo estricto para evitar errores comunes y malas prácticas

  let deck = [];
  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = []; // Array para almacenar los puntos de cada jugador

  //let puntosJugador = 0,
  // puntosComputadora = 0;

  // REFERENCIAS HTML

  const btnPedir = document.querySelector("#btnPedirCarta"),
    btnPlantarse = document.querySelector("#btnPlantarse"),
    btnNuevoJuego = document.querySelector("#btnNuevoJuego");

  const divCartasJugadores = document.querySelectorAll(".divCartas"),
    puntosHTML = document.querySelectorAll("small"); // Puntos HTML

  // Inicialización del juego
  const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = []; // Reinicia los puntos de los jugadores

    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0); // Inicializa los puntos de cada jugador en 0
    }

    puntosHTML.forEach((elem) => {
      elem.innerText = 0; // ForEach sirve para iterar sobre los elementos de puntosHTML y asignarles el valor 0
    });

    divCartasJugadores.forEach((elem) => {
      elem.innerHTML = ""; // ForEach sirve para iterar sobre los elementos de divCartasJugadores y limpiar su contenido
    });

    btnPedir.disabled = false;
    btnPlantarse.disabled = false;
  };

  // Función para crear un nuevo mazo de cartas
  const crearDeck = () => {
    deck = []; // Reinicia el mazo de cartas

    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        // Itera sobre cada tipo de carta
        deck.push(i + tipo); // Agrega cartas del 2 al 10
      }
    }
    for (let tipo of tipos) {
      for (let esp of especiales) {
        // Itera sobre cada tipo de carta
        deck.push(esp + tipo); // Agrega cartas especiales
      }
    }

    return _.shuffle(deck); // Utilizando underscore para barajar
  };

  // Función para pedir una carta del mazo

  const pedirCarta = () => {
    if (deck.length === 0) {
      throw new Error("No hay cartas en el mazo");
    }

    return deck.pop(); // Retorna la última carta del mazo eliminándola del mazo con el método pop
  };

  // Función para calcular el valor de una carta
  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);

    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  // Acumula puntos para el jugador actual
  const acumularPuntosJugadores = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];

    return puntosJugadores[turno]; // Retorna los puntos acumulados del jugador actual
  };

  const determinarGanador = () => {
    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      // Espera un momento antes de mostrar el resultado debido a la naturaleza asíncrona de JavaScript
      if (puntosComputadora > 21) {
        alert("Jugador ha ganado, la computadora se ha pasado de 21");
      } else if (puntosComputadora === puntosMinimos) {
        alert("Empate");
      } else if (puntosMinimos > 21) {
        alert("La computadora ha ganado, te pasaste de 21");
      } else {
        alert("Computadora ha ganado");
      }
    }, 100);
  };

  // Turno de la computadora

  const turnoDeComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;
    do {
      const carta = pedirCarta();
      puntosComputadora = acumularPuntosJugadores(
        carta,
        puntosJugadores.length - 1
      );

      crearCartas(carta, puntosJugadores.length - 1);

      if (puntosMinimos > 21) {
        break;
      }
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    determinarGanador(); // Determina el ganador después de que la computadora termina su turno
  };

  // Crear Cartas

  const crearCartas = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`; // Asigna la ruta de la carta dentro de backticks
    imgCarta.classList.add("carta"); // Añade la clase carta

    divCartasJugadores[turno].append(imgCarta); // Añade la imagen al contenedor de cartas del jugador
  };

  // EVENTOS

  // Pedir una carta
  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();

    const puntosJugador = acumularPuntosJugadores(carta, 0);

    crearCartas(carta, 0);

    if (puntosJugador > 21) {
      btnPedir.disabled = true; // Deshabilita el botón de pedir carta
      turnoDeComputadora(puntosJugador); // Inicia el turno de la computadora
    } else if (puntosJugador === 21) {
      btnPedir.disabled = true; // Deshabilita el botón de pedir carta
      turnoDeComputadora(puntosJugador); // Inicia el turno de la computadora
    }
  });

  // Botón para detener el juego

  // Agregamos el event listener para el boton de plantarse
  btnPlantarse.addEventListener("click", () => {
    btnPedir.disabled = true; // Si plantamos no tiene sentido pedir más cartas
    btnPlantarse.disabled = true; // Y si ya nos plantamos, no tiene sentido que se pueda volver a pulsar el botón de plantarse

    turnoDeComputadora(puntosJugadores[0]); // Por ende iniciamos el turno de la computadora
  });

  // btnNuevoJuego.addEventListener("click", () => {
  //   inicializarJuego(); // Reinicia el juego
  // });

  return {
    nuevoJuego: inicializarJuego, // Exporta la función para reiniciar el juego
  };
};
