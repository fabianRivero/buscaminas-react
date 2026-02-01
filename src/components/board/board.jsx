import { checkWin, flag, loseGame, revealCell } from '../../utils/gameLogic';
//Componente del tablero de juego
function Board({ rows, cols, gameState, updateGameState }) {

  //La función del click izquierdo de cada casilla
  const onCellLeftClick = (rowIndex, colIndex) => { 
    //Si el estado de gameOver está activado se 
    // elimina la funcionalidad del click izquierdo
    if(gameState.gameOver === true) return;
            
    //Si se clickead en una mina se activa el estado de "loseGame"
    if(gameState.board[rowIndex][colIndex].mine){
        const loseState = loseGame(gameState, rows, cols)
        updateGameState(loseState)
        return;
    }
    //Si se clickea en una casilla flageada no hace nada
    if(gameState.board[rowIndex][colIndex].flagged) return;

    //Entonces: si se clickea en una casila que no es mina o no esta flageada
    //se crea un nuevo tablero con el cambio del click en la casilla seleccionada 
    const newBoard = revealCell(gameState.board, rowIndex, colIndex)

    //Se actualiza el estado del juego con el nuevo talbero con los cambios correspondientes
    updateGameState({
        ...gameState,
        board: [...newBoard] 
    })

    //Se revisa si las condiciones de victoria se cumplen
    //Si se cumplen. se cambia el estado del juego a el estado de juego ganado
    if (checkWin(gameState)){
      updateGameState(checkWin(gameState))
    };
  }

    //La función del click derecho de cada casilla
  const onCellRightClick = (event, gameState, rowIndex, colIndex) => {
    event.preventDefault()
    //Si el estado del juego tiene gameOver = true => no hace nada
    if(gameState.gameOver === true) return;
    //Flagea la casilla y actualiza el tablero en el estado 
    updateGameState(flag(gameState, rowIndex, colIndex))

  }
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${gameState.board[0]?.length}, 30px)` }}>      
      {/*La clase de la casilla cambia deacuerdo a su estado para los estilos*/}
      {/*Las casillas no se clickean si el juego no esta activo o si la casilla está revelada*/}
      {gameState.board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell.revealed ? 'revealed' : ''} ${cell.revealed && cell.mine ? 'mine' : ''} ${cell.flagged ? 'flagged' : ''}`}
            onClick={() => onCellLeftClick(rowIndex, colIndex)}
            onContextMenu={(event) => onCellRightClick(event, gameState, rowIndex, colIndex)}
            disabled={!gameState.started || gameState.gameOver || cell.revealed}
          >
            {cell.revealed && cell.mine ? '💣' : cell.revealed && cell.adjacent > 0 ? cell.adjacent : cell.flagged ? "🚩" : ""}
          </button>
        ))
      )}
    </div>
  );
}

export default Board;
