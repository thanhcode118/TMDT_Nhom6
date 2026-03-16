using HomeDecorShop.Domain;

namespace HomeDecorShop.Application;

public interface IProductService
{
    ProductListResult Search(ProductQuery query);
    Product? GetById(int id);
    Product Create(ProductUpsertInput input);
    Product? Update(int id, ProductUpsertInput input);
    bool Delete(int id);
}
