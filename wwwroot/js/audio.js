/**
 * Sistema de Audio para Sala de Escape
 * Gestiona música de fondo y efectos de sonido
 * Música: Solo una activa, con transiciones suaves
 * Efectos: Múltiples simultáneos
 * 
 * ============ EJEMPLOS DE USO ============
 * 
 * // Reproducir música (archivo, transición en ms, volumen 0-1)
 * audioManager.playMusic('ambiente.mp3', 800, 0.4);
 * 
 * // Cambiar a otra música con transición suave
 * audioManager.playMusic('tensión.mp3', 600, 0.6);
 * 
 * // Reproducir efecto de sonido (archivo, delay en ms, volumen 0-1)
 * audioManager.playSoundEffect('puerta.mp3', 0, 0.7);
 * 
 * // Reproducir efecto con delay
 * audioManager.playSoundEffect('alarma.mp3', 500, 0.8);
 * 
 * // Controlar música
 * audioManager.pauseMusic();           // Pausar
 * audioManager.resumeMusic();          // Reanudar
 * audioManager.stopMusic(500);         // Detener con fade out
 * audioManager.setMusicVolume(0.3);    // Cambiar volumen
 * audioManager.getMusicVolume();       // Obtener volumen actual
 * 
 * // Detener todos los efectos
 * audioManager.stopAllEffects();
 */

class AudioManager {
    constructor() {
        this.musicaActual = null;
        this.volumeMusicaActual = 1;
        this.fadeInterval = null;
        this.efectos = [];
        this.rutaBase = '/sonido/';
    }

    /**
     * Reproduce música de fondo
     * @param {string} archivo - Nombre del archivo (sin ruta)
     * @param {number} retrazo - Duración de la transición en ms (default 500ms)
     * @param {number} volumen - Volumen final (0 a 1, default 0.5)
     */
    playMusic(archivo, retrazo = 500, volumen = 0.5) {
        if (!archivo) {
            console.error('AudioManager: Debe proporcionar un archivo de música');
            return;
        }

        // Si es la misma música, no hacer nada
        if (this.musicaActual && this.musicaActual.src.includes(archivo)) {
            return;
        }

        // Detener música anterior con fade out
        if (this.musicaActual) {
            this.fadeOut(this.musicaActual, retrazo, () => {
                this.musicaActual.pause();
                this.musicaActual.currentTime = 0;
            });
        }

        // Crear nuevo elemento de audio
        const nuevoAudio = new Audio();
        nuevoAudio.src = this.rutaBase + archivo;
        nuevoAudio.loop = true;
        nuevoAudio.volume = 0; // Comenzar silencioso
        nuevoAudio.preload = 'auto';
        
        // Manejar errores
        nuevoAudio.onerror = () => {
            console.error(`AudioManager: Error al cargar ${archivo}`);
        };

        // Reiniciar música si termina (opcional, ya que loop=true)
        nuevoAudio.onended = () => {
            nuevoAudio.currentTime = 0;
            nuevoAudio.play().catch(err => {
                console.warn('AudioManager: No se pudo reanudar música:', err.message);
            });
        };

        // Cuando la música se carga, comenzar
        nuevoAudio.oncanplay = () => {
            if (nuevoAudio === this.musicaActual) {
                this.fadeIn(nuevoAudio, retrazo, volumen);
            }
        };

        this.musicaActual = nuevoAudio;
        this.volumeMusicaActual = volumen;
        
        // Reproducir e iniciar fade in
        const playPromise = nuevoAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Autoplay permitido
                    this.fadeIn(nuevoAudio, retrazo, volumen);
                })
                .catch(err => {
                    // Autoplay bloqueado, esperar interacción
                    console.warn('AudioManager: Autoplay bloqueado. Se reproducirá al interactuar.');
                    // No detener el intento, seguir intentando
                    setTimeout(() => {
                        if (nuevoAudio === this.musicaActual) {
                            const retryPlay = nuevoAudio.play();
                            if (retryPlay !== undefined) {
                                retryPlay.catch(e => {
                                    console.warn('AudioManager: No se pudo reproducir música', e.message);
                                });
                            }
                        }
                    }, 100);
                });
        }
    }

    /**
     * Reproduce un efecto de sonido
     * Puede haber múltiples efectos simultáneos
     * @param {string} archivo - Nombre del archivo (sin ruta)
     * @param {number} retrazo - Delay antes de reproducir en ms (default 0)
     * @param {number} volumen - Volumen del efecto (0 a 1, default 0.7)
     */
    playSoundEffect(archivo, retrazo = 0, volumen = 0.7) {
        if (!archivo) {
            console.error('AudioManager: Debe proporcionar un archivo de efecto');
            return;
        }

        const efecto = new Audio();
        efecto.src = this.rutaBase + archivo;
        efecto.volume = volumen;

        // Manejar errores
        efecto.onerror = () => {
            console.error(`AudioManager: Error al cargar efecto ${archivo}`);
        };

        // Limpiar del array cuando termine
        efecto.onended = () => {
            const idx = this.efectos.indexOf(efecto);
            if (idx !== -1) {
                this.efectos.splice(idx, 1);
            }
            efecto.pause();
            // Liberar memoria
            efecto.src = '';
        };

        this.efectos.push(efecto);

        // Reproducir con delay opcional
        if (retrazo > 0) {
            setTimeout(() => {
                efecto.play().catch(err => {
                    console.error('AudioManager: Error al reproducir efecto', err);
                });
            }, retrazo);
        } else {
            efecto.play().catch(err => {
                console.error('AudioManager: Error al reproducir efecto', err);
            });
        }
    }

    /**
     * Detiene la música actual
     * @param {number} retrazo - Duración del fade out en ms
     */
    stopMusic(retrazo = 500) {
        if (!this.musicaActual) return;

        this.fadeOut(this.musicaActual, retrazo, () => {
            this.musicaActual.pause();
            this.musicaActual.currentTime = 0;
            this.musicaActual = null;
        });
    }

    /**
     * Pausa la música actual
     */
    pauseMusic() {
        if (this.musicaActual) {
            this.musicaActual.pause();
        }
    }

    /**
     * Reanuda la música actual
     */
    resumeMusic() {
        if (this.musicaActual) {
            this.musicaActual.play().catch(err => {
                console.error('AudioManager: Error al reanudar música', err);
            });
        }
    }

    /**
     * Detiene todos los efectos
     */
    stopAllEffects() {
        this.efectos.forEach(efecto => {
            efecto.pause();
            efecto.currentTime = 0;
            efecto.src = '';
        });
        this.efectos = [];
    }

    /**
     * Traición de volumen suavizado (fade in)
     * @private
     */
    fadeIn(audio, duracion, volumenFinal) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);

        const pasos = 50;
        const incremento = volumenFinal / pasos;
        const intervalo = duracion / pasos;
        let paso = 0;

        this.fadeInterval = setInterval(() => {
            paso++;
            audio.volume = Math.min(incremento * paso, volumenFinal);

            if (paso >= pasos) {
                audio.volume = volumenFinal;
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }, intervalo);
    }

    /**
     * Transición de volumen suavizado (fade out)
     * @private
     */
    fadeOut(audio, duracion, callback) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);

        const volumenInicial = audio.volume;
        const pasos = 50;
        const decremento = volumenInicial / pasos;
        const intervalo = duracion / pasos;
        let paso = 0;

        this.fadeInterval = setInterval(() => {
            paso++;
            audio.volume = Math.max(volumenInicial - (decremento * paso), 0);

            if (paso >= pasos) {
                audio.volume = 0;
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                if (callback) callback();
            }
        }, intervalo);
    }

    /**
     * Cambia el volumen de la música actual
     */
    setMusicVolume(volumen) {
        if (this.musicaActual) {
            this.musicaActual.volume = Math.max(0, Math.min(1, volumen));
            this.volumeMusicaActual = this.musicaActual.volume;
        }
    }

    /**
     * Obtiene el volumen actual de la música
     */
    getMusicVolume() {
        return this.musicaActual ? this.musicaActual.volume : 0;
    }
}

// Instancia global del gestor de audio
const audioManager = new AudioManager();
