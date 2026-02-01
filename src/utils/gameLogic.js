import clockFunction from "./clock";
import { loadBestTime, saveBestTimeIfNeeded } from "./store";

//Estado inicial del juego en ei que el juego no ha empezado
export const initalState = {
  started: false,
  board: [],
  minesLeft: 0,
  mines: 0,
  flags: 0,
  gameOver: false,
  timer: 0,
  message: "Indica la dificultad o ingresa manualmente las filas, columnas y minas.",
  bestTime: "-"
}

//Esta función comineza el juego con las filas, colu,nas y minas especificadas
//añade el tablero creado y el mejor tiempo (si existe) y devuelve un nuevo estado de juego 
export function startGame(rows, cols, mines) {
  //Se crea el tablero de juego
  const board = createBoard(rows, cols, mines);
  //Se obtiene el mejor tiempo del tablero establecido
  const bestTimeValue = loadBestTime(rows, cols, mines)

  //Devuelve el estado de inicio de juego con los valores establecidos
  return {
    board,
    minesLeft: mines,
    mines: mines,
    flags: 0,
    gameOver: false,
    timer: 0,
    message: "¡Buena suerte! Click izquierdo para revelar casilla, click derecho para poner bandera.",
    bestTime: bestTimeValue
  };
}

//Función que crea el tablero inicial
export function createBoard(rows, cols, mines) {
  //Se crea un tablero de casillas vacias
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      flagged: false,
      mine: false,
      adjacent: 0,
    }))
  );

  //Se establece las minas al tablero de forma aleatoria
  placeMines(board, rows, cols, mines);
  //Se establece el numero de minas adyacentes en cada casilla del tablero 
  computeAdjacents(board, rows, cols);

  //Devuelve el tablero inicial
  return board;
}

//Función que planta minas en el tablero de forma aleatoria
function placeMines(board, rows, cols, mines) {
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    //Solo se establece una mina si esta casilla no tenia una mina previamente 
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

//Función que registra las minas adyacencias de cada casilla
function computeAdjacents(board, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      //Si la casilla es una mina, pasa a la siguiente
      if (board[r][c].mine) continue;
      //Cuenta las casillas con minas que estan adyacentes y la agrega a 
      //la propiedad de "adjacent" de la casilla
      board[r][c].adjacent = countNeighborMines(board, rows, cols, r, c);
    }
  }
}

//Función que cuenta las minas adyacentes de una casilla
function countNeighborMines(board, rows, cols, r, c) {
  let count = 0;
  //Recorre las casillas alrededor de la casilla en cuestión 
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      //Si las las casillas alrededor estan dentro del tablero y son minas 
      //se añade una mina al contador
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
        count++;
      }
    }
  }
  //La función devuelve el resultado total del contador
  return count;
}


//Función que revela la casilla si no estaba recelada previamente
//Tambien revela las casillas adyacentes si estas 
// forman una "burbuja" de espacios vacios
export function revealCell(board, row, col) {
  if (board[row][col].revealed) return;
  board[row][col].revealed = true;

  // Si la celda no tiene minas adyacentes, revelamos las celdas vecinas
  if (board[row][col].adjacent === 0 && !board[row][col].mine && !board[row][col].flagged) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length && !board[row][col].mine && !board[row][col].flagged) {
          revealCell(board, nr, nc);
        }
      }
    }
  }
  //La funcion devuelve el nuevo tablero con las casillas reveladas
  return board;
}

//Función que flagea o desflagea la casilla seleccionada
export function flag(state, row, col) {
  //Si la casilla está revelada no hace nada
  if (state.board[row][col].revealed) return state; 

  //Se crea un nuevo tablero en el que se flagea o desflagea
  //la casilla seleccionada
  const newBoard = state.board.map((rowArr, rIndex) => 
    rowArr.map((cell, cIndex) => {
      if (rIndex === row && cIndex === col) {
        return { ...cell, flagged: !cell.flagged };
      }
      return cell;
    })
  );

  //Se vueven a contar la cantidad de banderas en el tablero
  const flagsNumber = countFlags(newBoard);

  /*
  Se devuelve un nuevo estado con los cambios een el tablero el numero de minas 
  restantes (que no refleja cuantas minas quedan realmentesino que asume 
  que la casilla flageada es una mina) y el numero de banderas colocadas
  */
  return {
    ...state,
    board: newBoard,
    minesLeft: state.mines - flagsNumber,
    flags: flagsNumber
  };
}

//Función que cuenta todas las casillas flageadas en el tablero
export function countFlags(board) {
  let flags = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (board[r][c].flagged) flags++;
    }
  }
  return flags;
}
//Función que devuelve un nuevo estado de juego si las condiciones de victoria se cumplen
export function checkWin(state) {
  const revealedCells = state.board.flat().filter(cell => cell.revealed).length;
  const totalCells = state.board.length * state.board[0].length;
  /*
  Si la cantidad de casillas reveladas es igual  
  al total de casillas menos las minas se gana el juego
  */
  if (revealedCells === totalCells - state.board.flat().filter(cell => cell.mine).length) {
    //Se guarda el tiempo en la variable "time"
    const time = clockFunction(state)

    //Se flagea todas las casillas con minas
    const newBoard = state.board.map((rowArr) => {
      return rowArr.map((cell) => {
        if (cell.mine) {
          return { ...cell, flagged: true }
        } else {
            return cell
        }
      })
    });

    //Se crea un nuevo estado de juego ganado
    const newState = {
      started: false,
      board: newBoard,
      minesLeft: state.minesLeft,
      mines: state.mines,
      flags: state.flags,
      gameOver: true,
      timer: state.timer,
      message: `🎉 ¡Ganaste! Tiempo: ${time}`,
      bestTime: time
    }

    //Se guarda el tiempo en el localStorage si es un nuevo record
    saveBestTimeIfNeeded(newState)

    //Se devuelve el estado
    return newState;
  }
}
//Función que crea el estado de juego perdido
export function loseGame(state, rows, cols) {
  //Se obtiene el tablero
  const newBoard = [...state.board]

  //Se revelan todas las casillas con minas y 
  //Se le da la clase "mine" para los estilos
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) {
        newBoard[r][c].revealed = true
        newBoard[r][c].class = "mine"
      };
    }
  }
  
  //Se crea el estado de juego perdido
  const newState = {
    started: false,
    board: newBoard,
    minesLeft: state.minesLeft,
    mines: state.mines,
    flags: state.flags,
    gameOver: true,
    timer: state.timer,
    message: "Game Over. Pisaste una mina.",
    bestTime: "-"
  }

  //Se devuelve ese estado
  return newState;
}
