import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutFacade } from '@/features/checkout/data-access/checkout.facade';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[70vh] bg-cream py-12">
      <div class="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
          <h1 class="text-3xl font-bold text-charcoal">Thanh toán</h1>

          <div>
            <h2 class="text-lg font-bold mb-3">Thông tin nhận hàng</h2>
            <div class="grid md:grid-cols-2 gap-3">
              <input [(ngModel)]="fullName" placeholder="Họ tên" class="border rounded-lg px-3 py-2">
              <input [(ngModel)]="phone" placeholder="Số điện thoại" class="border rounded-lg px-3 py-2">
              <input [(ngModel)]="address" placeholder="Địa chỉ" class="border rounded-lg px-3 py-2 md:col-span-2">
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold mb-3">Sản phẩm trong giỏ</h2>
            <div class="space-y-2">
              @for (item of cartItemsDetailed(); track item.id) {
                <div class="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p class="font-semibold">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">SL: {{ item.quantity }}</p>
                  </div>
                  <p class="font-bold">{{ item.lineTotal | currency:'VND':'symbol':'1.0-0' }}</p>
                </div>
              }
            </div>
          </div>

          <div>
            <h2 class="text-lg font-bold mb-3">Phương thức thanh toán</h2>
            <div class="flex flex-col gap-2">
              <label class="border rounded-lg p-3 cursor-pointer"><input type="radio" name="payment" [(ngModel)]="paymentMethod" value="cod"> Thanh toán khi nhận hàng (COD)</label>
              <label class="border rounded-lg p-3 cursor-pointer"><input type="radio" name="payment" [(ngModel)]="paymentMethod" value="bank"> Chuyển khoản ngân hàng</label>
              <label class="border rounded-lg p-3 cursor-pointer"><input type="radio" name="payment" [(ngModel)]="paymentMethod" value="wallet"> Ví điện tử</label>
            </div>
          </div>
        </div>

        <aside class="bg-white rounded-xl shadow p-6 h-fit space-y-4">
          <h2 class="text-xl font-bold">Tóm tắt đơn hàng</h2>

          <div class="flex gap-2">
            <input [(ngModel)]="couponCode" placeholder="Mã giảm giá" class="flex-1 border rounded-lg px-3 py-2">
            <button class="bg-charcoal text-white px-3 rounded-lg" (click)="applyCoupon()">Áp dụng</button>
          </div>
          @if (couponMessage()) {
            <p class="text-sm text-green-600">{{ couponMessage() }}</p>
          }

          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Tạm tính</span><span>{{ subtotal() | currency:'VND':'symbol':'1.0-0' }}</span></div>
            <div class="flex justify-between"><span>Giảm giá</span><span>-{{ discount() | currency:'VND':'symbol':'1.0-0' }}</span></div>
            <div class="flex justify-between"><span>Phí ship</span><span>{{ shippingFee() | currency:'VND':'symbol':'1.0-0' }}</span></div>
            <hr>
            <div class="flex justify-between text-base font-bold"><span>Tổng cộng</span><span>{{ grandTotal() | currency:'VND':'symbol':'1.0-0' }}</span></div>
          </div>

          <button class="w-full bg-honey text-charcoal font-bold py-3 rounded-lg" (click)="placeOrder()">Đặt hàng</button>
          @if (orderMessage()) {
            <p class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">{{ orderMessage() }}</p>
          }
        </aside>
      </div>
    </section>
  `
})
export class CheckoutComponent {
  private readonly checkoutFacade = inject(CheckoutFacade);

  readonly cartItemsDetailed = this.checkoutFacade.cartItemsDetailed;
  readonly subtotal = this.checkoutFacade.subtotal;
  readonly shippingFee = this.checkoutFacade.shippingFee;

  fullName = '';
  phone = '';
  address = '';
  paymentMethod = 'cod';
  couponCode = '';

  couponMessage = signal('');
  orderMessage = signal('');
  discount = signal(0);

  grandTotal = computed(() => {
    return this.subtotal() - this.discount() + this.shippingFee();
  });

  applyCoupon(): void {
    if (this.couponCode.trim().toUpperCase() === 'BEE10') {
      this.discount.set(Math.round(this.subtotal() * 0.1));
      this.couponMessage.set('Áp dụng mã BEE10 thành công (giảm 10%).');
      return;
    }

    this.discount.set(0);
    this.couponMessage.set('Mã không hợp lệ. Thử mã BEE10.');
  }

  placeOrder(): void {
    this.orderMessage.set('Đặt hàng mock thành công. Cảm ơn bạn đã mua sắm tại BeeShop!');
  }
}
