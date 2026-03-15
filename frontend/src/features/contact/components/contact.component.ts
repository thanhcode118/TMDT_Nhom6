import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactFacade } from '@/features/contact/data-access/contact.facade';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-cream min-h-screen py-12">
      <div class="container mx-auto px-4 space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-charcoal">Liên hệ và Feedback</h1>
          <p class="text-gray-600 mt-1">Gửi thông tin để BeeShop hỗ trợ nhanh nhất.</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-bold mb-4">Gửi feedback</h2>
            <form class="space-y-3" (ngSubmit)="submit()">
              <input [(ngModel)]="name" name="name" placeholder="Họ tên" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
              <input [(ngModel)]="email" name="email" placeholder="Email" class="w-full border border-gray-300 rounded-lg px-3 py-2" type="email" required>
              <textarea [(ngModel)]="message" name="message" placeholder="Nội dung" class="w-full border border-gray-300 rounded-lg px-3 py-2 h-28" required></textarea>
              <button class="bg-charcoal text-white px-4 py-2 rounded-lg font-semibold hover:bg-honey hover:text-charcoal transition-colors" type="submit">Gửi feedback</button>
            </form>
          </div>

          <div class="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 class="text-xl font-bold">Google Maps</h2>
            <iframe
              title="beeshop-map"
              class="w-full h-64 rounded-lg border"
              src="https://maps.google.com/maps?q=Ha%20Noi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy">
            </iframe>
            <p class="text-sm text-gray-600">Địa chỉ: 123 Tổ Ong, Hà Nội</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-bold mb-4">Danh sách feedback</h2>
          <div class="space-y-3">
            @for (item of contactFacade.feedbackList(); track item.id) {
              <div class="border border-gray-200 rounded-lg p-3">
                <div class="flex justify-between">
                  <p class="font-semibold text-charcoal">{{ item.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.createdAt }}</p>
                </div>
                <p class="text-xs text-gray-500 mb-1">{{ item.email }}</p>
                <p class="text-sm text-gray-700">{{ item.message }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  contactFacade = inject(ContactFacade);

  name = '';
  email = '';
  message = '';

  submit(): void {
    this.contactFacade.submitFeedback(this.name, this.email, this.message);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
