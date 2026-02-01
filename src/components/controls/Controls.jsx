import { initalState, startGame } from "../../utils/gameLogic";


function Controls({ cols, rows, mines, gameState, updateCols, updateRows, updateMines, updateGameState }) {

    //Función para manejar el valor del input de filas
    const handleRows = (event) => {
        const newNum = parseInt(event.target.value, 10);
        updateRows(newNum);
    };

    //Función para manejar el valor del input de columnas
    const handleCols = (event) => {
        const newNum = parseInt(event.target.value, 10);
        updateCols(newNum);
    };

    //Función para manejar el valor del input de minas
    const handleMines = (event) => {
        const newNum =  parseInt(event.target.value, 10);
        updateMines(newNum);
    };

    //Función para setear las fias, columnas y minas en dificultad facil 
    const easyBtn = () => {
        updateCols(6);
        updateRows(6);
        updateMines(4);
    }

    //Función para setear las fias, columnas y minas en dificultad media
    const midBtn = () => {
        updateCols(9);
        updateRows(9);
        updateMines(14);
    }

    //Función para setear las fias, columnas y minas en dificultad dificil
    const hardBtn = () => {
        updateCols(10);
        updateRows(20);
        updateMines(40);
    }

    //Función para el boton que inicia el juego 
    const startBtn = () => {
        //Función que devuelve el estado inicial del juego
        const gamestats = startGame(rows, cols, mines);
        //Se actualiza el estado inicial a el estado de juego comenzado
        updateGameState({
            started: true,
            board: gamestats.board,
            minesLeft: gamestats.minesLeft,
            mines: gamestats.mines,
            gameOver: gamestats.gameOver,
            timer: gamestats.timer,
            message: gamestats.message,
            bestTime: gamestats.bestTime
        });
    }

    //Función del boton de reiniciar el juego
    const restartBtn = () => {
        //Actualiza el estado con el estado inicial de juego sin comenzar
        updateGameState(initalState);
    }
    
  return (
    <div className="controls">
        <div className="dificulty">
            <h2>Dificultades:</h2>
            <div>
                <button id="easy" type="button" onClick={easyBtn}>Facil</button>
                <button id="mid" type="button" onClick={midBtn}>Intermedio</button>
                <button id="hard" type="button" onClick={hardBtn}>Dificil</button>
            </div>
        </div>

        <div className="mode">
            <label>
            Filas
            <input id="rows" type="number" min="4" max="30" onChange={handleRows} value={rows} />
            </label>
            <label>
            Columnas
            <input id="cols" type="number" min="4" max="30" onChange={handleCols} value={cols} />
            </label>
            <label>
            Minas
            <input id="mines" type="number" min="1" onChange={handleMines} value={mines} />
            </label>
        </div>

        <div className="start-restart">
            <button id="startBtn" className={gameState.started ? "disabled" : "enabled"} type="button" onClick={startBtn} disabled={gameState.started}>
                Iniciar
            </button>

            <button id="restartBtn" type="button" onClick={restartBtn} >
                Reiniciar
            </button>
        </div>
    </div>
  );
}

export default Controls;
