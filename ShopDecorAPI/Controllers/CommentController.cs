using Microsoft.AspNetCore.Mvc;
using ShopDecorAPI;          // 👈 để nhận AppDbContext
using ShopDecorAPI.Models;   // 👈 để nhận Comment
using System;
using System.Linq;
[ApiController]
[Route("api/comments")]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(Comment model)
    {
        model.Id = Guid.NewGuid();
        model.CreatedAt = DateTime.UtcNow;

        _context.Comments.Add(model);
        _context.SaveChanges();

        return Ok(model);
    }

    [HttpGet("{productId}")]
    public IActionResult Get(Guid productId)
    {
        var data = _context.Comments
            .Where(x => x.ProductId == productId)
            .ToList();

        return Ok(data);
    }
}