using api.Dtos.Category;
//using api.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/category")]
[ApiController]
public class CategoryController : ControllerBase{

private readonly AppDBContext _context;

    public CategoryController(AppDBContext context){
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAllCategories(GetCategoriesDto1 getCategoriesDto1){
        // var categories = _context.Categories.ToList()
        // .Select(s => s.ToCategoryDto());

        var categories2 = new Category(){
                Id = getCategoriesDto1.Id,
                Nombre = getCategoriesDto1.Nombre,
                Books = getCategoriesDto1.Books
            };

        return Ok(categories2);
    }

    [HttpGet("{id}")]
    public IActionResult GetCategoryById([FromRoute] string id){
        var category = _context.Categories.Find(id);

        if(category == null){
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    public IActionResult CreateCategory([FromBody] CreateCategoryDto createCategoryDto){
        
        var categoryEntity = new Category(){
            Nombre = createCategoryDto.Nombre
        };

        _context.Categories.Add(categoryEntity);
        _context.SaveChanges();

        return Ok(categoryEntity);

        // var categoryModel = createCategoryDto.ToCategoryFromCreateDto();
        // _context.Categories.Add(categoryModel);
        // _context.SaveChanges();
        // return CreatedAtAction(nameof(GetCategoryById), new {id = categoryModel.Id}, categoryModel.ToCategoryDto());
    }
}