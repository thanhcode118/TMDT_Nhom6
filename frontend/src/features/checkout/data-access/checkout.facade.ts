import { Injectable, inject } from '@angular/core';
import { CommerceStore } from '@/features/commerce/data-access/commerce.store';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  private readonly commerceStore = inject(CommerceStore);

  readonly users = this.commerceStore.users;
  readonly orders = this.commerceStore.orders;
  readonly activeCart = this.commerceStore.activeCart;
  readonly cartCount = this.commerceStore.cartCount;

  addToCart(productId?: number, quantity = 1): void {
    this.commerceStore.addToCart(productId, quantity);
  }
}
