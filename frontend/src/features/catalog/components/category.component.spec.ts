import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compileComponents();
  });

  it('creates the catalog category page', () => {
    const fixture = TestBed.createComponent(CategoryComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
