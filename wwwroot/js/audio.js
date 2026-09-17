/*
 * INSTRUCCIONES RAPIDAS
 * - musica: se repite en bucle y reemplaza la musica anterior.
 * - audio: se reproduce una sola vez, desde el principio hasta el final.
 * - Usa null cuando una vista no deba reproducir ese tipo de audio.
 * - Los volumenes aceptan valores entre 0 y 1.
 * - Para reproducir un efecto desde cualquier otro JS:
 *     audioManager.playSoundEffect("moneda.mp3", 0.8);
 * - Para cambiar la musica desde cualquier otro JS:
 *     audioManager.playMusic("Last Ride In.mp3", 0.5);
 * Los nombres deben coincidir con los archivos de /wwwroot/sonido.
 */
var audioPorVista = {
	Index: { musica: "musicaMenu (among us).mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	Nosotros: { musica: "musicaMenu (among us).mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	IniciarSesion: { musica: "musicaMenu (among us).mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	Registrarse: { musica: "musicaMenu (among us).mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala1: { musica: "Last Ride In.mp3", volumenMusica: 0.3, audio: "despertador.mp3", volumenAudio: 0.5 },
	sala2: { musica: "sonidoCalle.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala3: { musica: "Last Ride In.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala4: { musica: "tormenta.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala5: { musica: "Losfer Words.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala6: { musica: "tornadoOfSouls.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala7: { musica: "Losfer Words.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala8: { musica: "musicaMenu (among us).mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala9: { musica: "Last Ride In.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 },
	sala10: { musica: "blue skies.mp3", volumenMusica: 0.3, audio: null, volumenAudio: 1 }
};

(function () {
	var musicaActual = null;
	var reintentoRegistrado = false;
	var rutaAudio = "/sonido/";

	function crearAudio(archivo, volumen, loop) {
		var audio = new Audio(rutaAudio + encodeURIComponent(archivo));
		audio.volume = Math.max(0, Math.min(1, Number(volumen)));
		audio.loop = loop;
		return audio;
	}

	function reproducir(audio) {
		var promesa = audio.play();
		if (promesa && typeof promesa.catch === "function") {
			return promesa;
		}
		return Promise.resolve();
	}

	function reproducirSonido(archivo, inicioOvolumen, volumen) {
		if (!archivo) return Promise.resolve();
		var volumenFinal = volumen === undefined ? (inicioOvolumen === undefined ? 1 : inicioOvolumen) : volumen;
		var sonido = crearAudio(archivo, volumenFinal, false);
		if (volumen !== undefined && Number.isFinite(Number(inicioOvolumen))) {
			sonido.currentTime = Math.max(0, Number(inicioOvolumen));
		}
		return reproducir(sonido);
	}

	function reproducirMusica(archivo, volumen) {
		if (!archivo) return Promise.resolve();

		if (musicaActual) {
			musicaActual.pause();
			musicaActual.currentTime = 0;
		}

		musicaActual = crearAudio(archivo, volumen === undefined ? 1 : volumen, true);
		return reproducir(musicaActual);
	}

	window.audioManager = {
		playSoundEffect: function (archivo, inicioOvolumen, volumen) {
			return reproducirSonido(archivo, inicioOvolumen, volumen).catch(function (error) {
				console.warn("No se pudo reproducir el sonido:", error);
			});
		},
		playMusic: function (archivo, volumen) {
			return reproducirMusica(archivo, volumen);
		},
		stopMusic: function () {
			if (musicaActual) {
				musicaActual.pause();
				musicaActual.currentTime = 0;
				musicaActual = null;
			}
		}
	};

	function obtenerVistaActual() {
		var partes = window.location.pathname.split("/").filter(Boolean);
		var accion = partes.length > 1 ? partes[1] : "Index";

		if (accion.toLowerCase() === "entrar") {
			var numero = new URLSearchParams(window.location.search).get("numero");
			return numero ? "sala" + numero : "Index";
		}

		return accion || "Index";
	}

	function iniciarAudioDeVista() {
		var configuracion = audioPorVista[obtenerVistaActual()];
		if (!configuracion) return;

		function iniciarConfiguracion() {
			var reproducciones = [];
			if (configuracion.musica) {
				reproducciones.push(reproducirMusica(configuracion.musica, configuracion.volumenMusica));
			}
			if (configuracion.audio) {
				reproducciones.push(reproducirSonido(configuracion.audio, configuracion.volumenAudio));
			}
			return Promise.all(reproducciones);
		}

		iniciarConfiguracion().catch(function (error) {
			console.warn("El navegador bloqueo el audio automatico:", error);
			if (reintentoRegistrado) return;

			reintentoRegistrado = true;
			document.addEventListener("click", function reintentarUnaVez() {
				iniciarConfiguracion().catch(function (reintentoError) {
					console.warn("No se pudo iniciar la musica tras el primer clic:", reintentoError);
				});
			}, { once: true });
		});
	}

	document.addEventListener("DOMContentLoaded", iniciarAudioDeVista);
})();
