using System.Globalization;
using HomeDecorShop.Domain;
using Microsoft.Extensions.DependencyInjection;

namespace HomeDecorShop.Infrastructure;

public sealed class InMemoryProductRepository : IProductRepository
{
    private readonly List<Product> products = SeedProducts().ToList();
    private readonly object lockObject = new();

    public IReadOnlyCollection<Product> GetAll()
    {
        lock (lockObject)
        {
            return products.ToArray();
        }
    }

    public Product? GetById(int id)
    {
        lock (lockObject)
        {
            return products.FirstOrDefault(p => p.Id == id);
        }
    }

    public Product Create(Product product)
    {
        lock (lockObject)
        {
            var nextId = products.Count == 0 ? 1 : products.Max(p => p.Id) + 1;
            var created = product with { Id = nextId };
            products.Add(created);
            return created;
        }
    }

    public Product? Update(Product product)
    {
        lock (lockObject)
        {
            var index = products.FindIndex(p => p.Id == product.Id);
            if (index < 0)
            {
                return null;
            }

            products[index] = product;
            return product;
        }
    }

    public bool Delete(int id)
    {
        lock (lockObject)
        {
            var index = products.FindIndex(p => p.Id == id);
            if (index < 0)
            {
                return false;
            }

            products.RemoveAt(index);
            return true;
        }
    }

    private static IReadOnlyCollection<Product> SeedProducts() =>
    [
        new(1, "HD-BED-001", "Giường gỗ sồi Oslo", "giuong-go-soi-oslo", 8490000, 9790000, 1, "Phòng ngủ", "/assets/products/bed-oslo-1.jpg", "/assets/products/bed-oslo-2.jpg", null, "Best Seller", 80, 14, 4.8, 248, "Nordic Home", "Nâu gỗ", "Gỗ sồi", "Scandinavian", true, true, DateTime.Parse("2025-11-12", CultureInfo.InvariantCulture)),
        new(2, "HD-BED-002", "Tủ đầu giường Luna", "tu-dau-giuong-luna", 1450000, null, 1, "Phòng ngủ", "/assets/products/nightstand-luna-1.jpg", "/assets/products/nightstand-luna-2.jpg", null, null, null, 31, 4.6, 116, "Nordic Home", "Kem", "Gỗ MDF", "Modern", true, true, DateTime.Parse("2025-12-05", CultureInfo.InvariantCulture)),
        new(3, "HD-LIV-001", "Sofa vải Cloud 3 chỗ", "sofa-vai-cloud-3-cho", 12990000, 14990000, 2, "Phòng khách", "/assets/products/sofa-cloud-1.jpg", "/assets/products/sofa-cloud-2.jpg", null, "Flash Sale", 67, 6, 4.9, 312, "CozyNest", "Xám", "Vải nỉ", "Minimal", true, true, DateTime.Parse("2026-01-08", CultureInfo.InvariantCulture)),
        new(4, "HD-LIV-002", "Bàn trà tròn Mellow", "ban-tra-tron-mellow", 2990000, null, 2, "Phòng khách", "/assets/products/table-mellow-1.jpg", "/assets/products/table-mellow-2.jpg", null, null, null, 0, 4.4, 74, "CozyNest", "Đen", "Kim loại", "Industrial", false, true, DateTime.Parse("2025-10-30", CultureInfo.InvariantCulture)),
        new(5, "HD-DIN-001", "Bàn ăn Oakline 6 ghế", "ban-an-oakline-6-ghe", 10890000, 12490000, 3, "Phòng ăn", "/assets/products/dining-oakline-1.jpg", "/assets/products/dining-oakline-2.jpg", null, "Top Rated", 72, 8, 4.8, 194, "WoodCraft", "Nâu sáng", "Gỗ cao su", "Contemporary", true, true, DateTime.Parse("2025-09-21", CultureInfo.InvariantCulture)),
        new(6, "HD-DIN-002", "Ghế ăn Vera", "ghe-an-vera", 990000, null, 3, "Phòng ăn", "/assets/products/chair-vera-1.jpg", "/assets/products/chair-vera-2.jpg", null, null, null, 55, 4.5, 93, "WoodCraft", "Be", "Gỗ + nệm", "Modern", true, true, DateTime.Parse("2025-12-20", CultureInfo.InvariantCulture)),
        new(7, "HD-DEC-001", "Đèn bàn Amber", "den-ban-amber", 590000, 790000, 4, "Trang trí", "/assets/products/lamp-amber-1.jpg", "/assets/products/lamp-amber-2.jpg", null, "Sale", 60, 41, 4.7, 167, "LumiHaus", "Vàng đồng", "Kim loại", "Vintage", true, true, DateTime.Parse("2026-02-03", CultureInfo.InvariantCulture)),
        new(8, "HD-DEC-002", "Gương treo tường Halo", "guong-treo-tuong-halo", 1890000, null, 4, "Trang trí", "/assets/products/mirror-halo-1.jpg", "/assets/products/mirror-halo-2.jpg", null, null, null, 19, 4.5, 88, "LumiHaus", "Bạc", "Kính", "Modern", true, true, DateTime.Parse("2025-08-14", CultureInfo.InvariantCulture)),
        new(9, "HD-WOR-001", "Bàn làm việc Shift", "ban-lam-viec-shift", 4290000, 4790000, 5, "Phòng làm việc", "/assets/products/desk-shift-1.jpg", "/assets/products/desk-shift-2.jpg", null, "Hot", 76, 11, 4.7, 141, "UrbanDesk", "Nâu đậm", "Gỗ công nghiệp", "Minimal", true, true, DateTime.Parse("2026-01-17", CultureInfo.InvariantCulture)),
        new(10, "HD-WOR-002", "Ghế công thái học Arc", "ghe-cong-thai-hoc-arc", 3590000, null, 5, "Phòng làm việc", "/assets/products/chair-arc-1.jpg", "/assets/products/chair-arc-2.jpg", null, null, null, 7, 4.6, 122, "UrbanDesk", "Đen", "Lưới", "Contemporary", true, true, DateTime.Parse("2025-11-03", CultureInfo.InvariantCulture)),
        new(11, "HD-OUT-001", "Ghế ban công Breeze", "ghe-ban-cong-breeze", 1290000, 1590000, 6, "Ngoài trời", "/assets/products/balcony-breeze-1.jpg", "/assets/products/balcony-breeze-2.jpg", null, "Sale", 55, 24, 4.4, 69, "Gardenia", "Xanh rêu", "Mây nhựa", "Bohemian", true, true, DateTime.Parse("2025-07-26", CultureInfo.InvariantCulture)),
        new(12, "HD-OUT-002", "Bộ bàn ghế sân vườn Terra", "bo-ban-ghe-san-vuon-terra", 9790000, null, 6, "Ngoài trời", "/assets/products/garden-terra-1.jpg", "/assets/products/garden-terra-2.jpg", null, null, null, 3, 4.3, 48, "Gardenia", "Nâu", "Nhôm sơn tĩnh điện", "Modern", true, true, DateTime.Parse("2025-06-11", CultureInfo.InvariantCulture))
    ];
}

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly List<User> users =
    [
        new(
            1,
            "admin@beeshop.vn",
            "Admin BeeShop",
            "0900000001",
            UserRole.Admin,
            "123456",
            DateTime.Parse("2025-01-12", CultureInfo.InvariantCulture),
            []),
        new(
            2,
            "user@beeshop.vn",
            "Ngọc Nguyễn",
            "0900000002",
            UserRole.Customer,
            "123456",
            DateTime.Parse("2025-02-24", CultureInfo.InvariantCulture),
            [
                new Address(
                    1,
                    "Ngọc Nguyễn",
                    "0900000002",
                    "123 Nguyễn Trãi",
                    "Phường 2",
                    "Quận 5",
                    "TP.HCM",
                    true)
            ])
    ];

    private readonly object lockObject = new();

    public IReadOnlyCollection<User> GetAll()
    {
        lock (lockObject)
        {
            return users.ToArray();
        }
    }

    public User? GetById(int id)
    {
        lock (lockObject)
        {
            return users.FirstOrDefault(u => u.Id == id);
        }
    }

    public User? GetByEmail(string email)
    {
        var normalized = Normalize(email);
        lock (lockObject)
        {
            return users.FirstOrDefault(u => Normalize(u.Email) == normalized);
        }
    }

    public User Create(User user)
    {
        lock (lockObject)
        {
            var nextId = users.Count == 0 ? 1 : users.Max(u => u.Id) + 1;
            var created = user with { Id = nextId };
            users.Add(created);
            return created;
        }
    }

    public User? Update(User user)
    {
        lock (lockObject)
        {
            var index = users.FindIndex(u => u.Id == user.Id);
            if (index < 0)
            {
                return null;
            }

            users[index] = user;
            return user;
        }
    }

    private static string Normalize(string? value) =>
        (value ?? string.Empty).Trim().ToLowerInvariant();
}

public static class InfrastructureDependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IProductRepository, InMemoryProductRepository>();
        services.AddSingleton<IUserRepository, InMemoryUserRepository>();
        return services;
    }
}
