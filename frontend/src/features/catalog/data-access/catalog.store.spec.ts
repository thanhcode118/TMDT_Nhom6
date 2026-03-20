import { TestBed } from '@angular/core/testing';
import { CatalogStore } from './catalog.store';

describe('CatalogStore', () => {
  let store: CatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CatalogStore);
  });

  it('loads catalog mock collections', () => {
    expect(store.categories().length).toBeGreaterThan(0);
    expect(store.categoryProducts().length).toBeGreaterThan(0);
    expect(store.newCollectionProducts().length).toBeGreaterThan(0);
  });

  it('builds a shared product index across catalog collections', () => {
    const productIds = store.allProducts().map((product) => product.id);

    expect(productIds).toContain(1);
    expect(productIds).toContain(9);
    expect(productIds).toContain(101);
    expect(productIds).toContain(501);
    expect(new Set(productIds).size).toBe(productIds.length);
  });

  it('finds products from multiple catalog collections by id', () => {
    expect(store.findProductById(101)?.slug).toBe('khay-cam-but-go-soi');
    expect(store.findProductById(501)?.slug).toBe('lo-hoa-gom-moc');
    expect(store.findProductById(1)?.slug).toBe('honeycomb-wall-shelf');
  });
});
