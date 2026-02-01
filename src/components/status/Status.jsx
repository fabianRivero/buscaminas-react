import { useEffect, useState, useRef } from 'react';
import clockFunction, { formatTime } from '../../utils/clock';

function Status({ gameState, updateGameState }) {
    //State del timer del juego
    const [ticks, setTicks] = useState(gameState.timer);
    //intervalo del timer
    const intervalRef = useRef(null);

    useEffect(() => {
        //Si el estado del juego tiene el estado started = false
        //se actualiza el timer a 0 de forma automatica
        if (!gameState.started) {
            setTicks(0);
            return;
        }
        intervalRef.current = setInterval(() => {
            //Con el interval se cambia la propiedad "timer" en el estado del juego    
            setTicks(prev => prev + 1);
            updateGameState({
                ...gameState, 
                timer: ticks + 1
            })
        }, 10);

        return () => clearInterval(intervalRef.current);
    }, [gameState, ticks, updateGameState]);

    //El timer que aparece en la interfaz
    const clock = clockFunction(gameState)

    //El mensaje que aparece en la interfaz según el estado del juego
    const newMessage = gameState.message;

    //El mejor tiempo que aparece solo si existe un tiempo con la modalidad escogida
    const newBestTime = gameState.bestTime === "-" || gameState.bestTime === "No Disponible" ?
        gameState.bestTime :    
        formatTime(gameState.bestTime)
    return (
        <section className="status">
            <div className='stats'>
                <div>Tiempo: <span id="time">{clock}</span></div>
                <div>Minas restantes: <span id="minesLeft">{gameState.minesLeft}</span></div>
                <div>Mejor tiempo: <span id="bestTime">{newBestTime}</span></div>
            </div>
            <br />
            <p id="message" className="message">{newMessage}</p>
        </section>
    );
}

export default Status;
