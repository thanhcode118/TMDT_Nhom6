import { TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent]
    }).compileComponents();
  });

  it('creates the checkout feature shell', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
