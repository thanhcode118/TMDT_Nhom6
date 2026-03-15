import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '@/features/auth/data-access/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-[70vh] bg-cream py-16">
      <div class="container mx-auto px-4 max-w-xl">
        <div class="bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h1 class="text-3xl font-bold text-charcoal mb-2">Đăng nhập</h1>
          <p class="text-sm text-gray-500 mb-6">Mock account: admin@beeshop.vn / 123456</p>

          @if (!authFacade.isAuthenticated()) {
            <form class="space-y-4" (ngSubmit)="submitLogin()">
              <div>
                <label class="text-sm font-semibold text-charcoal">Email</label>
                <input [(ngModel)]="email" name="email" class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2" type="email" required>
              </div>
              <div>
                <label class="text-sm font-semibold text-charcoal">Mật khẩu</label>
                <input [(ngModel)]="password" name="password" class="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2" type="password" required>
              </div>

              @if (authFacade.errorMessage()) {
                <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {{ authFacade.errorMessage() }}
                </div>
              }

              <button class="w-full bg-charcoal text-white py-3 rounded-lg font-bold hover:bg-honey hover:text-charcoal transition-colors" type="submit">
                Đăng nhập
              </button>
            </form>
          } @else {
            <div class="space-y-4">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="font-semibold text-green-700">Xin chào, {{ authFacade.currentUser()?.fullName }}</p>
                <p class="text-sm text-green-600">Vai trò: {{ authFacade.currentUser()?.role }}</p>
              </div>

              <div class="flex gap-3">
                <a routerLink="/admin" class="flex-1 text-center bg-honey text-charcoal py-2 rounded-lg font-semibold">Vào admin</a>
                <button class="flex-1 bg-gray-800 text-white py-2 rounded-lg font-semibold" (click)="logout()">Đăng xuất</button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  authFacade = inject(AuthFacade);
  private router = inject(Router);

  email = '';
  password = '';

  submitLogin(): void {
    const success = this.authFacade.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authFacade.logout();
  }
}
