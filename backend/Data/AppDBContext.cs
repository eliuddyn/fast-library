using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDBContext:DbContext{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options){}

    public DbSet<Category> Categories { get; set; }

    public DbSet<Author> Authors { get; set; }

    public DbSet<Book> Books { get; set; }

    public DbSet<Librarian> Librarians { get; set; }
    
    public DbSet<User> Users { get; set; }
}