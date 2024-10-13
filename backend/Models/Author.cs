namespace backend.Models;

public class Author
{
    public Guid Id { get; set; }
    public required string? Nombre { get; set; }

    //Relationship
    public List<Book> Books { get; set; } = new List<Book>();
    //public Guid? BookId { get; set; }
    //public Book? Book { get; set; }
}