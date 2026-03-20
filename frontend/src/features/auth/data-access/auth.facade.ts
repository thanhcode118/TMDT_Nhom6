import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'customer';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private http = inject(HttpClient);
  
private readonly apiUrl = 'https://localhost:5020/api/users'; 

  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly errorSignal = signal('');

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  readonly errorMessage = computed(() => this.errorSignal());

  login(email: string, password: string): Observable<boolean> {
    this.errorSignal.set('');
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem('token', user.token);
      }),
      map(() => true),
      catchError(err => {
        this.errorSignal.set(err.error?.message || 'Sai email hoặc mật khẩu.');
        return of(false);
      })
    );
  }

  register(data: any): Observable<boolean> {
    this.errorSignal.set('');
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, data).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem('token', user.token);
      }),
      map(() => true),
      catchError(err => {
        this.errorSignal.set(err.error?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
        return of(false);
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('token');
  }
}