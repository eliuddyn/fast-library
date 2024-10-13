namespace backend.Models;

public class Book
{
    public Guid Id { get; set; }
    public required string? Titulo { get; set; }
    public required string? descripcion { get; set; }
    public required string? fecha_publicacion { get; set; }

    //Relationships
    public List<Author> Authors { get; set; } = new List<Author>();
    public List<Category> Categories { get; set; } = new List<Category>();
}