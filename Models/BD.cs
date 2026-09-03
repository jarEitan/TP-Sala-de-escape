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

    public List<int> obtenerNivel(int id)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            return connection.Query<int>("select [usuario | nivel].[ID nivel] from Usuario INNER JOIN [usuario | nivel] ON [usuario | nivel].[ID usuario] = Usuario.ID where Usuario.ID = @id", new { id }).ToList();
        }
    }

    public void pasarNivel(int idUsuario, int nuevoNivel)
    {
        using (var connection = new SqlConnection(connectionString))
        {
            connection.Execute("EXEC SP_AgregarNivelUsuario @IdUsuario, @NuevoNivel", new { IdUsuario = idUsuario, NuevoNivel = nuevoNivel });
        }
    }
}