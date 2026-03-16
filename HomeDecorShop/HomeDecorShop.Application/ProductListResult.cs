using HomeDecorShop.Domain;

namespace HomeDecorShop.Application;

public sealed record ProductListResult(
    IReadOnlyCollection<Product> Items,
    int Total,
    int Page,
    int PageSize,
    string SortBy);
