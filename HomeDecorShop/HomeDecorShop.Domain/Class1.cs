namespace HomeDecorShop.Domain;

public sealed record Product(
    int Id, string Sku, string Name, string Slug, decimal Price, decimal? OriginalPrice,
    int CategoryId, string Category, string Image, string HoverImage, string? VideoUrl,
    string? Tag, int? SoldPercentage, int StockLeft, double Rating, int Reviews,
    string Brand, string Color, string Material, string Style, bool InStock,
    bool IsActive, DateTime CreatedAt);

public enum UserRole
{
    Admin,
    Customer
}

// Chuyển thành Class cho EF Core
public class Address
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    
    public User User { get; set; } = null!;
}

// Chuyển thành Class cho EF Core
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string PasswordHash { get; set; } = string.Empty; // Đổi thành PasswordHash
    public DateTime CreatedAt { get; set; }
    public string? CurrentToken { get; set; } // Lưu Token xác thực đơn giản

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}

public interface IProductRepository
{
    IReadOnlyCollection<Product> GetAll();
    Product? GetById(int id);
    Product Create(Product product);
    Product? Update(Product product);
    bool Delete(int id);
}

public interface IUserRepository
{
    IReadOnlyCollection<User> GetAll();
    User? GetById(int id);
    User? GetByEmail(string email);
    User? GetByToken(string token);
    User Create(User user);
    User? Update(User user);
}