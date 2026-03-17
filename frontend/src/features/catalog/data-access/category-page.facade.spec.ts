import { TestBed } from '@angular/core/testing';
import { CategoryPageFacade } from './category-page.facade';

describe('CategoryPageFacade', () => {
  let facade: CategoryPageFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryPageFacade]
    });
    facade = TestBed.inject(CategoryPageFacade);
  });

  it('filters category products by the selected style', () => {
    facade.toggleFilter('style', 'Minimalist');

    expect(facade.filteredProducts().length).toBeGreaterThan(0);
    expect(facade.filteredProducts().every((product) => product.style === 'Minimalist')).toBe(true);
  });

  it('sorts filtered products by ascending price', () => {
    facade.sort('price_asc', 'Giá: Thấp - Cao');

    const prices = facade.filteredProducts().map((product) => product.price);
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });

  it('resets pagination to the first page when a filter changes', () => {
    facade.loadMore();
    expect(facade.displayCount()).toBe(16);

    facade.togglePriceFilter('under200');

    expect(facade.displayCount()).toBe(8);
    expect(facade.filteredProducts().every((product) => product.price < 200000)).toBe(true);
  });
});
