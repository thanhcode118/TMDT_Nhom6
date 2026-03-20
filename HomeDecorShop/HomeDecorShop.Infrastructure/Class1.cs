using System.Globalization;
using HomeDecorShop.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HomeDecorShop.Infrastructure;

// --- GIỮ LẠI IN-MEMORY CỦA PRODUCT ---
public sealed class InMemoryProductRepository : IProductRepository
{
    /* ... (Giữ nguyên phần code InMemoryProductRepository cũ của bạn ở đây để không lỗi Product) ... */
    // (Mình rút gọn để tiết kiệm độ dài, bạn paste lại class InMemoryProductRepository cũ vào đây)
    public IReadOnlyCollection<Product> GetAll() => throw new NotImplementedException();
    public Product? GetById(int id) => throw new NotImplementedException();
    public Product Create(Product product) => throw new NotImplementedException();
    public Product? Update(Product product) => throw new NotImplementedException();
    public bool Delete(int id) => throw new NotImplementedException();
}

// --- THÊM DB CONTEXT CHO EF CORE ---
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique(); // Ràng buộc Email duy nhất

        modelBuilder.Entity<User>()
            .HasMany(u => u.Addresses)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId);
    }
}

// --- TẠO REPOSITORY MỚI DÙNG EF CORE ---
public sealed class SqlUserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public SqlUserRepository(AppDbContext context)
    {
        _context = context;
    }

    public IReadOnlyCollection<User> GetAll()
    {
        return _context.Users.Include(u => u.Addresses).ToList();
    }

    public User? GetById(int id)
    {
        return _context.Users.Include(u => u.Addresses).FirstOrDefault(u => u.Id == id);
    }

    public User? GetByEmail(string email)
    {
        return _context.Users.Include(u => u.Addresses).FirstOrDefault(u => u.Email == email.ToLower());
    }

    public User? GetByToken(string token)
    {
        return _context.Users.Include(u => u.Addresses).FirstOrDefault(u => u.CurrentToken == token);
    }

    public User Create(User user)
    {
        user.Email = user.Email.ToLower();
        _context.Users.Add(user);
        _context.SaveChanges();
        return user;
    }

    public User? Update(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
        return user;
    }
}

// --- CẬP NHẬT DEPENDENCY INJECTION ---
public static class InfrastructureDependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IProductRepository, InMemoryProductRepository>();
        
        // Đổi từ Singleton InMemory sang Scoped cho EF Core
        services.AddScoped<IUserRepository, SqlUserRepository>(); 
        return services;
    }
}