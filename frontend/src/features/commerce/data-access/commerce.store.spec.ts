import { TestBed } from '@angular/core/testing';
import { CommerceStore } from './commerce.store';

describe('CommerceStore', () => {
  let store: CommerceStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CommerceStore);
  });

  it('adds a new cart line for a known product id', () => {
    const before = store.activeCart();

    store.addToCart(109, 1);

    const updatedCart = store.activeCart();
    const addedItem = updatedCart.items.find((item) => item.productId === 109);

    expect(updatedCart.items).toHaveLength(before.items.length + 1);
    expect(store.cartCount()).toBe(3);
    expect(addedItem).toMatchObject({
      productId: 109,
      quantity: 1,
      unitPrice: 520000
    });
  });

  it('increments quantity for an existing cart line instead of creating a duplicate', () => {
    const before = store.activeCart();

    store.addToCart(101, 2);

    const updatedCart = store.activeCart();
    const existingItem = updatedCart.items.find((item) => item.productId === 101);

    expect(updatedCart.items).toHaveLength(before.items.length);
    expect(existingItem?.quantity).toBe(3);
    expect(store.cartCount()).toBe(4);
  });

  it('ignores unknown product ids', () => {
    const before = store.activeCart();

    store.addToCart(999, 1);

    expect(store.activeCart()).toEqual(before);
    expect(store.cartCount()).toBe(2);
  });
});
