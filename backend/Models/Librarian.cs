namespace backend.Models;

public class Librarian
{
    public Guid Id { get; set; }
    public required string Nombres { get; set; }
    public required string Apellidos { get; set; }
    public required string Genero { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
}