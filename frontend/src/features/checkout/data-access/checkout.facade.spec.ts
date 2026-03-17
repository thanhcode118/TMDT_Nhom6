import { TestBed } from '@angular/core/testing';
import { CheckoutFacade } from './checkout.facade';

describe('CheckoutFacade', () => {
  let facade: CheckoutFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(CheckoutFacade);
  });

  it('resolves cart item details from the shared product index', () => {
    const items = facade.cartItemsDetailed();

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      id: 1,
      productId: 101,
      quantity: 1,
      unitPrice: 150000,
      lineTotal: 150000
    });
    expect(items[1]).toMatchObject({
      id: 2,
      productId: 102,
      quantity: 1,
      unitPrice: 350000,
      lineTotal: 350000
    });
    expect(items[0].name).not.toContain('#101');
    expect(items[1].name).not.toContain('#102');
  });

  it('computes subtotal and shipping from the resolved cart items', () => {
    expect(facade.subtotal()).toBe(500000);
    expect(facade.shippingFee()).toBe(0);
  });
});
