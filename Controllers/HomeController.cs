using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Sala_de_escape.Models;

namespace Sala_de_escape.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        BD bd = new BD();
        List<int> niveles = new List<int>();
        string? id = HttpContext.Session.GetString("ID");

        if (!string.IsNullOrWhiteSpace(id) && int.TryParse(id, out int idUsuario))
        {
            niveles = bd.obtenerNivel(idUsuario);
        }

        if (niveles == null || niveles.Count == 0)
        {
            niveles.Add(1);
        }

        ViewBag.nivel = niveles;
        return View();
    }

    public IActionResult Nosotros()
    {
        return View();
    }

    public IActionResult IniciarSesion()
    {
        return View();
    }

    public IActionResult ValidarCuenta(string Nombre, string Contraseña){
        BD bd = new BD();
        Cuenta cuenta = bd.iniciarSesion(Nombre, Contraseña);
        if (cuenta == null)
        {
            string error = "El usuario y la contraseña no coinsiden.";
            ViewBag.Mensaje = error;
            return View("IniciarSesion");
        }
        HttpContext.Session.SetString("ID", cuenta.ID.ToString());
        HttpContext.Session.SetString("Nombre", cuenta.Nombre ?? string.Empty);

        return RedirectToAction("Index");
    }

    public IActionResult Registrarse()
    {
        return View();
    }

    public IActionResult CrearCuenta(Cuenta cuenta)
    {
        BD bd = new BD();
        List<string> usuariosExistentes = bd.obtenerNombres();
        if (usuariosExistentes.Contains(cuenta.Nombre))
        {
            string error = "El nombre de usuario ya está en uso. Por favor, elige otro.";
            ViewBag.Mensaje = error;
            return View("Registrarse");
        } else {
            int resultado = bd.crearCuenta(cuenta);
        }
        return RedirectToAction("Index");
    }

    public IActionResult CerrarSesion()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Index");
    }

    public IActionResult entrar(int numero)
    {
        BD bd = new BD();
        bd.pasarNivel(int.Parse(HttpContext.Session.GetString("ID") ?? "0"), numero);
        string num = numero.ToString();
        string sala = "sala" + num;
        return View(sala);
    }
    

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
