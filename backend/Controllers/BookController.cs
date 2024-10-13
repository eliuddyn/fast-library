using Microsoft.AspNetCore.Mvc;
using backend.Models;
namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BookController : ControllerBase {
    private readonly AppDBContext _context;

    public BookController(AppDBContext context){
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAllBooks(){
        var books = _context.Books.ToList();

        return Ok(books);
    }

}
