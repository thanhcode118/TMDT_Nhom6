import { Injectable, computed, signal } from '@angular/core';

interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'customer';
  password: string;
}

const MOCK_USERS: AuthUser[] = [
  { id: 1, email: 'admin@beeshop.vn', fullName: 'Admin BeeShop', role: 'admin', password: '123456' },
  { id: 2, email: 'user@beeshop.vn', fullName: 'Ngọc Nguyễn', role: 'customer', password: '123456' }
];

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly errorSignal = signal('');

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  readonly errorMessage = computed(() => this.errorSignal());

  login(email: string, password: string): boolean {
    const user = MOCK_USERS.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );

    if (!user) {
      this.errorSignal.set('Sai email hoặc mật khẩu. Thử tài khoản mock: admin@beeshop.vn / 123456');
      return false;
    }

    this.currentUserSignal.set(user);
    this.errorSignal.set('');
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
