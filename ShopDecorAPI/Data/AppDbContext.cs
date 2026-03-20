using Microsoft.EntityFrameworkCore;
using ShopDecorAPI.Models;   // 👈 THÊM DÒNG NÀY

namespace ShopDecorAPI       // 👈 KHÔNG để .Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<ProductReview> Reviews { get; set; }
        public DbSet<Comment> Comments { get; set; }
    }
}