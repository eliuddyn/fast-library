namespace backend.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
}