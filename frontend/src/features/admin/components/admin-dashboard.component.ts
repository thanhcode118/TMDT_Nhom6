import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFacade } from '@/features/admin/data-access/admin.facade';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-cream min-h-screen py-10">
      <div class="container mx-auto px-4 space-y-6">
        <h1 class="text-3xl font-bold text-charcoal">Trang quản trị</h1>

        <div class="grid md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-4 shadow">
            <p class="text-sm text-gray-500">Tổng sản phẩm</p>
            <p class="text-2xl font-bold">{{ adminFacade.products().length }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow">
            <p class="text-sm text-gray-500">Tổng đơn hàng</p>
            <p class="text-2xl font-bold">{{ adminFacade.orders().length }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow">
            <p class="text-sm text-gray-500">Người dùng</p>
            <p class="text-2xl font-bold">{{ adminFacade.users().length }}</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow">
            <p class="text-sm text-gray-500">Doanh thu (mock)</p>
            <p class="text-2xl font-bold">{{ adminFacade.totalRevenue() | currency:'VND':'symbol':'1.0-0' }}</p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl p-5 shadow">
            <h2 class="font-bold text-lg mb-3">Đơn hàng gần đây</h2>
            <div class="space-y-2">
              @for (order of adminFacade.orders(); track order.id) {
                <div class="border rounded-lg p-3 flex justify-between">
                  <div>
                    <p class="font-semibold">{{ order.orderCode }}</p>
                    <p class="text-xs text-gray-500">Status: {{ order.status }}</p>
                  </div>
                  <p class="font-bold">{{ order.totalAmount | currency:'VND':'symbol':'1.0-0' }}</p>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow">
            <h2 class="font-bold text-lg mb-3">Feedback mới</h2>
            <div class="space-y-2">
              @for (fb of adminFacade.feedback(); track fb.id) {
                <div class="border rounded-lg p-3">
                  <p class="font-semibold">{{ fb.name }}</p>
                  <p class="text-sm text-gray-700">{{ fb.content }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  adminFacade = inject(AdminFacade);
}
