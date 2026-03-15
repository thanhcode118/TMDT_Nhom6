import { Injectable, computed, inject, signal } from '@angular/core';
import { Cart, Order, User } from '@/core/models';
import { MOCK_CARTS, MOCK_ORDERS, MOCK_USERS, MOCK_CATEGORY_PRODUCTS, MOCK_TRENDING_PRODUCTS, MOCK_FLASH_SALE_PRODUCTS, MOCK_NEW_ARRIVALS_PRODUCTS, MOCK_NEW_COLLECTION_PRODUCTS } from '@/core/mock-data/ecommerce.mock';

@Injectable({ providedIn: 'root' })
export class CommerceStore {
  readonly users = signal<User[]>(MOCK_USERS);
  readonly orders = signal<Order[]>(MOCK_ORDERS);
  readonly activeCart = signal<Cart>(MOCK_CARTS[0]);

  private readonly allProducts = [
    ...MOCK_CATEGORY_PRODUCTS,
    ...MOCK_TRENDING_PRODUCTS,
    ...MOCK_FLASH_SALE_PRODUCTS,
    ...MOCK_NEW_ARRIVALS_PRODUCTS,
    ...MOCK_NEW_COLLECTION_PRODUCTS
  ];

  readonly cartCount = computed(() => {
    return this.activeCart().items.reduce((total, item) => total + item.quantity, 0);
  });

  addToCart(productId = 101, quantity = 1): void {
    this.activeCart.update((cart) => {
      const existingItem = cart.items.find((item) => item.productId === productId);
      if (existingItem) {
        return {
          ...cart,
          items: cart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          updatedAt: new Date().toISOString()
        };
      }

      const product = this.allProducts.find(p => p.id === productId);
      const unitPrice = product?.price ?? 0;

      return {
        ...cart,
        items: [
          ...cart.items,
          {
            id: Date.now(),
            productId,
            quantity,
            unitPrice
          }
        ],
        updatedAt: new Date().toISOString()
      };
    });
  }
}

