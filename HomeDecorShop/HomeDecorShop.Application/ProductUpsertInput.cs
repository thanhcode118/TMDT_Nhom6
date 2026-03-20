namespace HomeDecorShop.Application;

public sealed record ProductUpsertInput(
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
    bool IsActive);
