/**
 * ============ EJEMPLOS DE USO DEL SISTEMA DE AUDIO ============
 * 
 * // Reproducir música
 * audioManager.playMusic('niño-brasileño-cantando-pou-version-completa.mp3', 800, 0.4);
 * 
 * // Cambiar música con transición
 * audioManager.playMusic('sala1.mp3', 600, 0.5);
 * 
 * // Reproducir efecto
 * audioManager.playSoundEffect('puerta.mp3', 0, 0.7);
 * 
 * // Reproducir efecto con delay
 * audioManager.playSoundEffect('alarma.mp3', 500, 0.8);
 * 
 * // Controlar música
 * audioManager.pauseMusic();
 * audioManager.resumeMusic();
 * audioManager.stopMusic(500);
 * audioManager.setMusicVolume(0.3);
 * 
 * // Detener efectos
 * audioManager.stopAllEffects();
 * 

var mensaje = document.getElementById("mensaje");
var salaActiva = 1;
var pestañaActiva;

// ============ SISTEMA DE MÚSICA POR VIEW ============

/**
 * Mapeo de vistas a canciones
 * Formato: 'nombreView': { archivo: 'cancion.mp3', volumen: 0.5 }
 */
const musicasPorView = {
    'Index': { archivo: 'ambiente.mp3', volumen: 0.4 },
    'Registrarse': { archivo: 'ambiente.mp3', volumen: 0.4 },
    'IniciarSesion': { archivo: 'ambiente.mp3', volumen: 0.4 },
    'Nosotros': { archivo: 'ambiente.mp3', volumen: 0.4 },
    'sala1': { archivo: 'sala1.mp3', volumen: 0.5 },
    'sala2': { archivo: 'sala2.mp3', volumen: 0.5 },
    'sala3': { archivo: 'sala3.mp3', volumen: 0.5 },
    'sala4': { archivo: 'sala4.mp3', volumen: 0.5 },
    'sala5': { archivo: 'sala5.mp3', volumen: 0.5 },
    'sala6': { archivo: 'sala6.mp3', volumen: 0.5 },
    'sala7': { archivo: 'sala7.mp3', volumen: 0.5 },
};

/**
 * Detecta la vista actual y reproduce la música correspondiente
 */
function detectarViewYReproducirMusica() {
    // Validar que audioManager esté disponible
    if (typeof audioManager === 'undefined') {
        console.warn('AudioManager no está disponible aún, reintentando...');
        setTimeout(detectarViewYReproducirMusica, 100);
        return;
    }

    // Opción 1: Buscar atributo data-music en el body
    const dataMusicBody = document.body.getAttribute('data-music');
    if (dataMusicBody) {
        const config = musicasPorView[dataMusicBody];
        if (config) {
            audioManager.playMusic(config.archivo, 800, config.volumen);
            console.log(`🎵 Música iniciada (data-music): ${config.archivo}`);
            return;
        }
    }

    // Opción 2: Buscar variable global windowViewName (establecida en las vistas)
    if (typeof windowViewName !== 'undefined' && windowViewName) {
        const config = musicasPorView[windowViewName];
        if (config) {
            audioManager.playMusic(config.archivo, 800, config.volumen);
            console.log(`🎵 Música iniciada (windowViewName): ${config.archivo}`);
            return;
        }
    }

    // Opción 3: Detectar por URL
    const urlActual = window.location.pathname.toLowerCase();
    for (const [view, config] of Object.entries(musicasPorView)) {
        if (urlActual.includes(view.toLowerCase())) {
            audioManager.playMusic(config.archivo, 800, config.volumen);
            console.log(`🎵 Música iniciada (URL): ${config.archivo}`);
            return;
        }
    }

    // Fallback: reproducir canción por defecto
    audioManager.playMusic('niño-brasileño-cantando-pou-version-completa.mp3', 800, 0.4);
    console.log(`🎵 Música iniciada (fallback): niño-brasileño-cantando-pou-version-completa.mp3`);
}

/**
 * Inicialización múltiple para asegurar que funcione en cualquier escenario
 */
function inicializarMusica() {
    // Intentar iniciar música
    detectarViewYReproducirMusica();
    
    // Reintentos adicionales en caso de que no haya funcionado
    setTimeout(() => {
        if (typeof audioManager !== 'undefined' && !audioManager.musicaActual) {
            console.warn('Reintentando inicialización de música...');
            detectarViewYReproducirMusica();
        }
    }, 500);

    setTimeout(() => {
        if (typeof audioManager !== 'undefined' && !audioManager.musicaActual) {
            console.warn('Tercer intento de inicialización de música...');
            detectarViewYReproducirMusica();
        }
    }, 1500);
}

// Múltiples puntos de disparo para asegurar ejecución
if (document.readyState === 'loading') {
    // Documento aún cargándose
    document.addEventListener('DOMContentLoaded', inicializarMusica);
} else {
    // Documento ya cargado
    inicializarMusica();
}

// Evento load (después de todas las imágenes y recursos)
window.addEventListener('load', function() {
    if (typeof audioManager !== 'undefined' && !audioManager.musicaActual) {
        console.log('Iniciando música desde evento load...');
        detectarViewYReproducirMusica();
    }
});

// Evento de cambio de estado del documento
document.addEventListener('readystatechange', function() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        if (typeof audioManager !== 'undefined' && !audioManager.musicaActual) {
            console.log(`Iniciando música desde readystatechange (${document.readyState})...`);
            detectarViewYReproducirMusica();
        }
    }
});

// Reiniciar música cuando el usuario interactúa
document.addEventListener('click', function iniciarAudio(event) {
    if (typeof audioManager !== 'undefined') {
        const musicaActiva = audioManager.musicaActual?.paused === false;
        if (!musicaActiva) {
            console.log('Iniciando música por interacción del usuario...');
            detectarViewYReproducirMusica();
        }
    }
}, { once: false });

// Detectar cuando el usuario regresa a la pestaña (para evitar conflictos)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Usuario minimizó o cambió de pestaña
        console.log('Página oculta');
    } else {
        // Usuario volvió a la pestaña
        console.log('Página visible, verificando música...');
        if (typeof audioManager !== 'undefined' && !audioManager.musicaActual) {
            detectarViewYReproducirMusica();
        }
    }
});

function _showMensaje(text) {
    var el = document.getElementById("mensaje");
    if (!el) return;
    el.innerHTML = text;
    el.style.display = "block";
}

function isTurnstileAvailable() {
    return !!document.querySelector('textarea[name="cf-turnstile-response"], input[name="cf-turnstile-response"]');
}

function getTurnstileResponse() {
    var el = document.querySelector('textarea[name="cf-turnstile-response"], input[name="cf-turnstile-response"]');
    return el ? (el.value || '').trim() : '';
}

function validarCuenta() {
    var usuario = document.getElementById("usuario") ? document.getElementById("usuario").value : "";
    var contrasena = document.getElementById("contrasena") ? document.getElementById("contrasena").value : "";
    if (usuario === "" || contrasena === "") {
        _showMensaje("Por favor, complete todos los campos.");
        return false;
    }

    var token = getTurnstileResponse();
    if (!token) {
        _showMensaje("Por favor, complete el captcha.");
        return false;
    }
    return true;
}

function validarRegistro() {
    var nombreUsuario = document.getElementById("nombre") ? document.getElementById("nombre").value : "";
    var contrasena = document.getElementById("contrasena") ? document.getElementById("contrasena").value : "";
    var soloLetrasYNumeros = /^[a-zA-Z0-9]+$/;
    var soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (nombreUsuario === "" || contrasena === "") {
        _showMensaje("Por favor, complete todos los campos.");
        return false;
    }
    if (contrasena.length < 8) {
        _showMensaje("La contraseña debe tener al menos 8 caracteres.");
        return false;
    }
    if (nombreUsuario.length < 3) {
        _showMensaje("El nombre de usuario debe tener al menos 3 caracteres.");
        return false;
    }
    if (!soloLetrasYNumeros.test(nombreUsuario)) {
        _showMensaje("El nombre de usuario solo puede contener letras y números, sin espacios ni caracteres especiales.");
        return false;
    }

    var token = getTurnstileResponse();
    if (!token) {
        _showMensaje("Por favor, complete el captcha.");
        return false;
    }
    return true;
}

// NUEVO: Modal de selección de salas
document.addEventListener('DOMContentLoaded', function () {
    var btnEntrar = document.getElementById('btnEntrar');
    var modalSalas = document.getElementById('modalSalas');
    var salaBtns = document.querySelectorAll('.salaBtn');

    if (btnEntrar) {
        btnEntrar.addEventListener('click', function () {
            modalSalas.classList.add('activo');
        });
    }

    salaBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var numero = this.getAttribute('data-numero');
            window.location.href = '/Home/entrar?numero=' + numero;
        });
    });

    if (modalSalas) {
        modalSalas.addEventListener('click', function (event) {
            if (event.target === modalSalas) {
                modalSalas.classList.remove('activo');
            }
        });
    }
});

function siguienteSala(numero, numero2) {
    const fase1 = document.getElementById(numero);
    fase1.style.display = "none";
    const fase2 = document.getElementById(numero2);
    fase2.style.display = "flex";
    salaActiva = numero2;
}

function fallarMatrixtoteles(origen) {
    siguienteSala(origen, 99);
    setTimeout(function () {
        siguienteSala(99, 100);
    }, 4000);
}

function validarTemperatura() {
    const temperaturaInput = document.getElementById("input").value;
    if (temperaturaInput == 96) {
        siguienteSala(2, 3);
    } else {
        document.getElementById("input").value = "";
        // Cambiar color del placeholder
        if (!document.getElementById('placeholder-error-style')) {
            const style = document.createElement('style');
            style.id = 'placeholder-error-style';
            style.innerHTML = '#input::placeholder { color: #ff6b6b; }';
            document.head.appendChild(style);
        }
    }
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "flex";
        pestañaActiva = id; // Guardar la pestaña activa
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "none";
        const inputCandado = document.getElementById("inputCandado");
        if (inputCandado) {
            inputCandado.value = "";
        }
        pestañaActiva = null; // Limpiar la pestaña activa al cerrar el modal
    }
}

function verificarCandado() {
    const codigoCandado = document.getElementById("inputCandado").value;
    if (codigoCandado == "1045") {
        alert("¡Candado abierto!");
        cerrarModal();
        siguienteSala(3, 6);
    } else {
        document.getElementById("inputCandado").value = "";
        document.getElementById("inputCandado").placeholder = "Numero incorrecto";
        // Cambiar color del placeholder
        if (!document.getElementById('placeholder-error-style-candado')) {
            const style = document.createElement('style');
            style.id = 'placeholder-error-style-candado';
            style.innerHTML = '#inputCandado::placeholder { color: #ff6b6b; }';
            document.head.appendChild(style);
        }
    }
}

function activarInventario() {
    const inventario = document.getElementById("inventario");
    if (inventario) {
        inventario.style.display = "flex";
    }
}

function agarrarItem(itemId, invId) {
    const item = document.getElementById(itemId);
    const inventario = document.getElementById(invId);
    if (item && inventario) {
        item.style.display = "none";
        inventario.style.display = "flex";
    }
}

function usarFiltro() {
    const item = document.getElementById("filtro");
    const monitor = document.getElementById("monitor-visible");
    const monitorEscondido = document.getElementById("monitor-escondido");
    if (pestañaActiva === "monitor" && item && monitor && monitorEscondido) {
        item.style.display = "none";
        monitorEscondido.style.display = "none";
        monitor.style.display = "flex";
    }
}

function usarTarjeta() {
    const item = document.getElementById("tarjeta");
    const caja = document.getElementById("botonCaja");
    if (item && salaActiva == 4) {
        item.style.display = "none";
        caja.style.display = "block";
    }
}

function verificarCaja() {
    const inputCaja1 = document.getElementById("inputCaja1");
    const inputCaja2 = document.getElementById("inputCaja2");
    const inputCaja3 = document.getElementById("inputCaja3");
    const carpeta = document.getElementById("carpeta");
    const botonSalir = document.getElementById("botonSalir");

    if (!inputCaja1 || !inputCaja2 || !inputCaja3) {
        return;
    }

    const codigoCaja1 = inputCaja1.value.trim();
    const codigoCaja2 = inputCaja2.value.trim();
    const codigoCaja3 = inputCaja3.value.trim();

    if (codigoCaja1 == "45" && codigoCaja2 == "19" && codigoCaja3 == "34") {
        alert("¡Caja abierta!");
        cerrarModal("caja");
        carpeta.style.display = "flex";
        botonSalir.style.display = "block";
    } else {
        inputCaja1.value = "";
        inputCaja2.value = "";
        inputCaja3.value = "";
        inputCaja1.placeholder = "Numero incorrecto";
        inputCaja2.placeholder = "Numero incorrecto";
        inputCaja3.placeholder = "Numero incorrecto";
    }
}

// Bate/guard handlers
var bateUsed = false;
var guardKillCount = 0;

function isBateInInventory() {
    var inv = document.getElementById('bate');
    if (!inv) return false;
    return window.getComputedStyle(inv).display !== 'none';
}

function usarBate() {
    var inv = document.getElementById('bate');
    if (!inv) return;
    // If bate is in inventory, use it: remove from inventory and enable bateUsed
    if (window.getComputedStyle(inv).display !== 'none') {
        inv.style.display = 'none';
        bateUsed = true;
    }
}

function handleSmithClick(id) {
    // id is 'smith1' or 'smith2'
    var guardImg = document.querySelector('img.' + id);
    if (bateUsed) {
        // kill the guard: play fall animation, hide modal, increment counter after animation
        if (guardImg) {
            // ensure no further clicks
            guardImg.style.pointerEvents = 'none';
            guardImg.classList.add('guard-fall');
            // after animation, mark as fallen and count
            var onEnd = function () {
                guardImg.classList.remove('guard-fall');
                guardImg.classList.add('guard-fallen');
                guardImg.removeEventListener('animationend', onEnd);
                guardKillCount += 1;
                checkShowArrow();
            };
            guardImg.addEventListener('animationend', onEnd);
        } else {
            // no image found, still increment
            guardKillCount += 1;
            checkShowArrow();
        }
        var modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    } else {
        // no bate used: open the modal as before
        abrirModal(id);
    }
}

function checkShowArrow() {
    if (guardKillCount >= 2) {
        var flecha = document.getElementById('flecha');
        if (flecha) {
            flecha.style.display = 'flex';
        }
    }
}

// Attach handlers after DOM ready to override inline onclicks
document.addEventListener('DOMContentLoaded', function () {
    var s1 = document.querySelector('img.smith1');
    var s2 = document.querySelector('img.smith2');
    if (s1) {
        s1.onclick = function (e) { handleSmithClick('smith1'); };
    }
    if (s2) {
        s2.onclick = function (e) { handleSmithClick('smith2'); };
    }
});

function verificarCandadoCarcel() {
    const codigoCandado = (document.getElementById("inputCandado").value || "").trim();
    // Acepta cualquier número negativo (enteros o con decimales, p.ej. -3 o -3.14)
    if (/^-\d+(?:\.\d+)?$/.test(codigoCandado)) {
        alert("¡Candado abierto!");
        cerrarModal();
        siguienteSala(2, 3);
    } else {
        document.getElementById("inputCandado").value = "";
        document.getElementById("inputCandado").placeholder = "Numero incorrecto";
        // Cambiar color del placeholder
        if (!document.getElementById('placeholder-error-style-candado')) {
            const style = document.createElement('style');
            style.id = 'placeholder-error-style-candado';
            style.innerHTML = '#inputCandado::placeholder { color: #ff6b6b; }';
            document.head.appendChild(style);
        }
    }
}