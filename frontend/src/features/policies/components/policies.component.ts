import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyFacade } from '@/features/policies/data-access/policy.facade';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-cream min-h-screen py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-charcoal mb-8">Chính sách</h1>

        <div class="grid md:grid-cols-3 gap-6">
          <article class="bg-white rounded-xl shadow p-5">
            <h2 class="text-lg font-bold text-charcoal mb-3">Đổi trả</h2>
            <ul class="space-y-2 text-sm text-gray-700">
              @for (line of policyFacade.returnPolicy(); track line) {
                <li>• {{ line }}</li>
              }
            </ul>
          </article>

          <article class="bg-white rounded-xl shadow p-5">
            <h2 class="text-lg font-bold text-charcoal mb-3">Bảo hành</h2>
            <ul class="space-y-2 text-sm text-gray-700">
              @for (line of policyFacade.warrantyPolicy(); track line) {
                <li>• {{ line }}</li>
              }
            </ul>
          </article>

          <article class="bg-white rounded-xl shadow p-5">
            <h2 class="text-lg font-bold text-charcoal mb-3">Vận chuyển</h2>
            <ul class="space-y-2 text-sm text-gray-700">
              @for (line of policyFacade.shippingPolicy(); track line) {
                <li>• {{ line }}</li>
              }
            </ul>
          </article>
        </div>
      </div>
    </section>
  `
})
export class PoliciesComponent {
  policyFacade = inject(PolicyFacade);
}
