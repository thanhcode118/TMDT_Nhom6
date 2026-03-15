import { TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryComponent]
    }).compileComponents();
  });

  it('creates the catalog category page', () => {
    const fixture = TestBed.createComponent(CategoryComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
