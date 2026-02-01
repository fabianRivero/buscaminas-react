//Función que recibe el esdo del juego y devuelve el reloj 
//con el formato del timer
export default function clockFunction(gameState){
    const clock = formatTime(gameState.timer)    

    return clock
}

//Función que recibe los segundos que pasaron y los devuelve 
//en formato minutos:segundos:milissegundos
export function formatTime(t) {
    const time = Number(t)
    const cs = time % 100;
    const totalSeconds = Math.floor(time / 100);
    const ss = totalSeconds % 60;
    const mm = Math.floor(totalSeconds / 60);

    const clockResult =
        `${String(mm).padStart(2, "0")}:` +
        `${String(ss).padStart(2, "0")}:` +
        `${String(cs).padStart(2, "0")}`;

    return clockResult
}