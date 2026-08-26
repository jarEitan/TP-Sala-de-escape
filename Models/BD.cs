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

}