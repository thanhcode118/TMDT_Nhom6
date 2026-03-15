import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent, RouterTestingModule]
    }).compileComponents();
  });

  it('creates the search page component', () => {
    const fixture = TestBed.createComponent(SearchResultsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
