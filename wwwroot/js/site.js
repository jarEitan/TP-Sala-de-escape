var mensaje = document.getElementById("mensaje");

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
document.addEventListener('DOMContentLoaded', function() {
    var btnEntrar = document.getElementById('btnEntrar');
    var modalSalas = document.getElementById('modalSalas');
    var salaBtns = document.querySelectorAll('.salaBtn');

    if (btnEntrar) {
        btnEntrar.addEventListener('click', function() {
            modalSalas.classList.add('activo');
        });
    }

    salaBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var numero = this.getAttribute('data-numero');
            window.location.href = '/Home/entrar?numero=' + numero;
        });
    });

    if (modalSalas) {
        modalSalas.addEventListener('click', function(event) {
            if (event.target === modalSalas) {
                modalSalas.classList.remove('activo');
            }
        });
    }
});