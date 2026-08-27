using Dapper;
using Microsoft.Data.SqlClient;

public class BD
{
    private static string connectionString = @"Server=localhost;DataBase=Matrix;Integrated Security=True;TrustServerCertificate=True;";

    public int crearCuenta(Cuenta cuenta)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            return connection.Execute("INSERT INTO Usuario (nombre, contraseña) VALUES (@Nombre, @Contraseña)", cuenta);
        }
    }

    public Cuenta iniciarSesion(string nombreUsuario, string contraseña)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            return connection.Query<Cuenta>("SELECT * FROM Usuario WHERE nombre = @Nombre AND contraseña = @Contraseña", new { Nombre = nombreUsuario, Contraseña = contraseña }).FirstOrDefault();
        }
    }

    public List<string> obtenerNombres()
    {
        using (var connection = new SqlConnection(connectionString))
        {
            return connection.Query<string>("SELECT nombre FROM Usuario").ToList();
        }
    }

    public List<niveles> obtenerNivel(int id)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            return connection.Query<niveles>("SELECT Nivel.ID, Nivel.nombre FROM [usuario | nivel] INNER join Nivel ON Nivel.ID = [usuario | nivel].[ID nivel] where [usuario | nivel].[ID usuario] = @id", new { id }).ToList();
        }
    }
}