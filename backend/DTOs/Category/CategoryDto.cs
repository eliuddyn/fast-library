
using backend.Models;

namespace api.Dtos.Category{
    public class GetCategoriesDto1{
        public Guid Id { get; set; }
        public required string Nombre { get; set; }

        //Relationship
        public List<Book> Books { get; set; } = new List<Book>();
    }

    public class CreateCategoryDto{
        public required string Nombre { get; set; }
    }
}