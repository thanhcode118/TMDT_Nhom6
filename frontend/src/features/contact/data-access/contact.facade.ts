import { Injectable, computed, signal } from '@angular/core';

interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private readonly feedbackSignal = signal<FeedbackItem[]>([
    {
      id: 1,
      name: 'Linh Trần',
      email: 'linh@gmail.com',
      message: 'Sản phẩm đẹp và giao nhanh, sẽ ủng hộ tiếp.',
      createdAt: '2026-03-10'
    },
    {
      id: 2,
      name: 'Minh Lê',
      email: 'minh@gmail.com',
      message: 'Cần thêm nhiều mẫu đèn trang trí cho phòng ngủ.',
      createdAt: '2026-03-11'
    }
  ]);

  readonly feedbackList = computed(() => this.feedbackSignal());

  submitFeedback(name: string, email: string, message: string): void {
    this.feedbackSignal.update((list) => [
      {
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...list
    ]);
  }
}
