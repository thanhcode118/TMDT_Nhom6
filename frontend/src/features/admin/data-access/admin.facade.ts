import { Injectable, computed, signal } from '@angular/core';
import { MOCK_CATEGORY_PRODUCTS, MOCK_ORDERS, MOCK_USERS } from '@/core/mock-data/ecommerce.mock';

@Injectable({ providedIn: 'root' })
export class AdminFacade {
  readonly products = signal(MOCK_CATEGORY_PRODUCTS);
  readonly orders = signal(MOCK_ORDERS);
  readonly users = signal(MOCK_USERS);
  readonly feedback = signal([
    { id: 1, name: 'Linh Trần', content: 'Cần thêm mẫu mới cho danh mục đèn.' },
    { id: 2, name: 'Khánh', content: 'Checkout mượt và dễ sử dụng.' }
  ]);

  readonly totalRevenue = computed(() => {
    return this.orders().reduce((sum, order) => sum + order.totalAmount, 0);
  });

  readonly pendingOrders = computed(() => {
    return this.orders().filter((order) => order.status === 'pending').length;
  });
}
