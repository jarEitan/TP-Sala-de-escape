// =========================================================
// SISTEMA DE AUDIO
// =========================================================

// ⚠️ CAMBIÁ ESTA RUTA según donde guardes tus archivos de audio
const RUTA_AUDIO = '/sonido/';

let musicaActual = null;
let timeoutMusica = null;
let sonidosActivos = [];

/**
 * Inicia una música de fondo (solo puede haber una a la vez).
 * @param {string} nombreArchivo - Nombre del archivo, ej: "tema-principal.mp3"
 * @param {number} retrasoMs - Milisegundos antes de reproducir (opcional)
 * @param {number} volumen - Volumen de 1 a 100 (opcional, default 100)
 */
function iniciarMusica(nombreArchivo, retrasoMs, volumen) {
    // Cancela cualquier música futura pendiente
    if (timeoutMusica) {
        clearTimeout(timeoutMusica);
        timeoutMusica = null;
    }

    // Si ya había una música, la detiene y la reutiliza
    if (musicaActual) {
        musicaActual.pause();
        musicaActual.currentTime = 0;
    } else {
        musicaActual = new Audio();
    }

    // Configura la nueva música
    musicaActual.src = RUTA_AUDIO + nombreArchivo;
    musicaActual.volume = normalizarVolumen(volumen);

    const reproducir = () => {
        musicaActual.play().catch(err => {
            console.error('No se pudo reproducir la música:', err);
        });
        timeoutMusica = null;
    };

    // Si hay retraso, lo programa; si no, reproduce ya
    if (retrasoMs && retrasoMs > 0) {
        timeoutMusica = setTimeout(reproducir, retrasoMs);
    } else {
        reproducir();
    }
}

/**
 * Detiene la música manualmente.
 */
function detenerMusica() {
    if (timeoutMusica) {
        clearTimeout(timeoutMusica);
        timeoutMusica = null;
    }
    if (musicaActual) {
        musicaActual.pause();
        musicaActual.currentTime = 0;
    }
}

/**
 * Inicia un efecto de sonido (pueden superponerse infinitos).
 * @param {string} nombreArchivo - Nombre del archivo, ej: "disparo.mp3"
 * @param {number} retrasoMs - Milisegundos antes de reproducir (opcional)
 * @param {number} volumen - Volumen de 1 a 100 (opcional, default 100)
 */
function iniciarSonido(nombreArchivo, retrasoMs, volumen) {
    const audio = new Audio(RUTA_AUDIO + nombreArchivo);
    audio.volume = normalizarVolumen(volumen);

    const reproducir = () => {
        audio.play().catch(err => {
            console.error('No se pudo reproducir el sonido:', err);
        });
    };

    if (retrasoMs && retrasoMs > 0) {
        setTimeout(reproducir, retrasoMs);
    } else {
        reproducir();
    }

    // Guardamos referencia temporal y la eliminamos al terminar
    sonidosActivos.push(audio);
    audio.addEventListener('ended', () => {
        sonidosActivos = sonidosActivos.filter(s => s !== audio);
    });
}

/**
 * Convierte el volumen de 1-100 a 0-1.
 * Si no se envía nada, usa 100 (máximo).
 */
function normalizarVolumen(volumen) {
    if (volumen === undefined || volumen === null || isNaN(volumen)) {
        return 1;
    }
    return Math.min(100, Math.max(1, Number(volumen))) / 100;
}
