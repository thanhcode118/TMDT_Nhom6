import { TestBed } from '@angular/core/testing';
import { SearchFacade } from './search.facade';

describe('SearchFacade', () => {
  let facade: SearchFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(SearchFacade);
  });

  it('matches accented product names when the query omits accents', () => {
    facade.setQuery('khay cam but go soi');

    expect(facade.results().at(0)?.id).toBe(101);
  });

  it('normalizes the price range when min is greater than max', () => {
    facade.setPriceRange(500000, 200000);

    expect(facade.minPrice()).toBe(200000);
    expect(facade.maxPrice()).toBe(500000);
  });

  it('round-trips query params without changing the search contract', () => {
    facade.setQuery('  den ngu  ');
    facade.toggleCategory('Lighting');
    facade.toggleBrand('LumiHome');
    facade.toggleStyle('Minimalist');
    facade.setPriceRange(200000, 900000);
    facade.setInStockOnly(true);
    facade.setOnSaleOnly(true);
    facade.setRatingGte(4);
    facade.setSortBy('price-desc');

    const params = facade.toQueryParams();

    facade.clearQuery();
    facade.clearAllFilters();
    facade.hydrateFromQueryParams({
      q: String(params.q),
      category: String(params.category),
      brand: String(params.brand),
      style: String(params.style),
      minPrice: String(params.minPrice),
      maxPrice: String(params.maxPrice),
      inStock: String(params.inStock),
      onSale: String(params.onSale),
      ratingGte: String(params.ratingGte),
      sort: String(params.sort)
    });

    expect(params).toEqual({
      q: 'den ngu',
      category: 'Lighting',
      brand: 'LumiHome',
      style: 'Minimalist',
      minPrice: 200000,
      maxPrice: 900000,
      inStock: 'true',
      onSale: 'true',
      ratingGte: 4,
      sort: 'price-desc'
    });
    expect(facade.query()).toBe('den ngu');
    expect(facade.selectedCategories()).toEqual(['Lighting']);
    expect(facade.selectedBrands()).toEqual(['LumiHome']);
    expect(facade.selectedStyles()).toEqual(['Minimalist']);
    expect(facade.minPrice()).toBe(200000);
    expect(facade.maxPrice()).toBe(900000);
    expect(facade.inStockOnly()).toBe(true);
    expect(facade.onSaleOnly()).toBe(true);
    expect(facade.ratingGte()).toBe(4);
    expect(facade.sortBy()).toBe('price-desc');
  });
});
