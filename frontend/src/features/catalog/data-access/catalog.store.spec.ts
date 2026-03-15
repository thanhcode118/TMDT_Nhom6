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
});
