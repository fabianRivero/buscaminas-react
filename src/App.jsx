import { useState } from 'react'
import './App.css'
import Controls from './components/controls/Controls'
import Status from './components/status/Status';
import { initalState } from './utils/gameLogic';
import Board from './components/board/board';

/* 
En App.jsx se usan los estados de filas, columnas, minas y el state del juego.
Se hacen cambios en los estados con funciones que realizan ese cambio y se pasan
esas funciones como props a los componentes de la aplicación.
*/

function App() {
  const [cols, setCols] = useState(5);
  const [rows, setRows] = useState(5);
  const [mines, setMines] = useState(8);
  const [gameState, setGameState] = useState(initalState);

  //Función para cambiar en state de columnas
  const updateCols = (num) => {
    setCols(num);
  };

  //Función para cambiar en state de filas
  const updateRows = (num) => {
    setRows(num);
  };

  //Función para cambiar en state de minas
  const updateMines = (num) => {
    setMines(num);
  };

  //Función para cambiar en state del juego
  const updateGameState = (st) => {
    setGameState(st);
  };


  return (
    <>
      <div>
        <h1>Buscaminas</h1>
        
        {/*
        Componente donde estan los botones que ajustan la dificultad,
        un boton para iniciar el juego y otro para reiniciarlo
        */}
        <Controls  
          cols={cols}
          rows={rows}
          mines={mines}
          gameState={gameState}
          updateCols={updateCols} 
          updateRows={updateRows} 
          updateMines={updateMines}
          updateGameState={updateGameState}
        />

        {/*
         Componente en en que se muestra el timer, las minas restantes 
         y el mejor tiempo para la modalidad escogida 
        */}
        <Status gameState={gameState} updateGameState={updateGameState} />

        {/*
        Componente que crea el tablero de casillas de juego
        */}        
        <Board           
          cols={cols}  
          rows={rows}
          gameState={gameState} 
          updateGameState={updateGameState}
        />
      </div>
    </>
  )
}

export default App
