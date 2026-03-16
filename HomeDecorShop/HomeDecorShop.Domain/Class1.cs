namespace HomeDecorShop.Domain;

public sealed record Product(
    int Id,
    string Sku,
    string Name,
    string Slug,
    decimal Price,
    decimal? OriginalPrice,
    int CategoryId,
    string Category,
    string Image,
    string HoverImage,
    string? VideoUrl,
    string? Tag,
    int? SoldPercentage,
    int StockLeft,
    double Rating,
    int Reviews,
    string Brand,
    string Color,
    string Material,
    string Style,
    bool InStock,
    bool IsActive,
    DateTime CreatedAt);

public enum UserRole
{
    Admin,
    Customer
}

public sealed record Address(
    int Id,
    string FullName,
    string Phone,
    string Line1,
    string Ward,
    string District,
    string City,
    bool IsDefault);

public sealed record User(
    int Id,
    string Email,
    string FullName,
    string Phone,
    UserRole Role,
    string Password,
    DateTime CreatedAt,
    IReadOnlyCollection<Address> Addresses);

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
    User Create(User user);
    User? Update(User user);
}
