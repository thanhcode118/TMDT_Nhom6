import { TestBed } from '@angular/core/testing';
import { CommerceStore } from './commerce.store';

describe('CommerceStore', () => {
  let store: CommerceStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CommerceStore);
  });

  it('adds item to cart using mock state', () => {
    const before = store.cartCount();
    store.addToCart(999, 1);
    expect(store.cartCount()).toBe(before + 1);
  });
});
