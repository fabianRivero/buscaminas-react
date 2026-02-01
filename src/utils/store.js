//Función que registra la modalidad de juego determinada tomando en cuanta
//filas/columnas/cantidad de minas para usarlo como key para el localStorage
export function storageKey(rows, cols, mines) {
  return `best_${rows}x${cols}_${mines}`;
}

//Carga el mejor tiempo en la modalidad que se escojió si existe y lo renderiza en el DOM
export function loadBestTime(rows, cols, mines) {
  if (!rows || !cols || !mines) return;
  const key = storageKey(rows, cols, mines);
  const best = localStorage.getItem(key);
  if(best){
    return best
  } else return "No Disponible";
}

//Función que guarda el mejor tiempo si este tiempo mejora al anterior record
export function saveBestTimeIfNeeded(state) {
  //Se guarda el el localStorage registrando filas/columnas/cantidad de minas
  //para records diferentes en diferentes modalidades de juego
  const key = storageKey(state.board.length, state.board[0].length, state.mines);
  const best = localStorage.getItem(key);
  if (!best || state.timer < Number(best)) {
    localStorage.setItem(key, String(state.timer));
  }
}
