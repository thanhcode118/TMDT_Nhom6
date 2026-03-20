using Microsoft.AspNetCore.Mvc;
using ShopDecorAPI;
using ShopDecorAPI.Models;
using System;
using System.Linq;

[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult Create(ProductReview model)
    {
        model.Id = Guid.NewGuid();
        model.CreatedAt = DateTime.UtcNow;

        _context.Reviews.Add(model);
        _context.SaveChanges();

        return Ok(model);
    }

    [HttpGet("{productId}")]
    public IActionResult Get(Guid productId)
    {
        var data = _context.Reviews
            .Where(x => x.ProductId == productId)
            .ToList();

        return Ok(data);
    }
}