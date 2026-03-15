import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchFacade, SearchSort } from '@/features/search/data-access/search.facade';
import { CheckoutFacade } from '@/features/checkout/data-access/checkout.facade';
import { IconComponent } from '@/shared/components/icon.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-cream min-h-screen pb-12">
      <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-8 space-y-4">
          <nav class="text-xs text-gray-500 flex gap-2">
            <span class="hover:text-honey cursor-pointer" (click)="goHome()">Trang chủ</span>
            <span>></span>
            <span class="font-bold text-charcoal">Tìm kiếm</span>
          </nav>

          <div class="flex flex-col lg:flex-row lg:items-end gap-4">
            <div class="flex-1">
              <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Tìm sản phẩm</label>
              <div class="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <app-icon name="search" class="w-4 h-4 text-gray-400"></app-icon>
                <input
                  [value]="searchFacade.query()"
                  (input)="onSearchInput($event)"
                  placeholder="Tên sản phẩm, mã SKU, chất liệu..."
                  class="w-full bg-transparent outline-none text-sm text-charcoal"
                >
                @if (searchFacade.query()) {
                  <button class="text-xs text-gray-500 hover:text-charcoal" (click)="clearQuery()">Xóa</button>
                }
              </div>
            </div>

            <div class="w-full lg:w-64">
              <label class="block text-xs uppercase tracking-wide text-gray-500 mb-2">Sắp xếp</label>
              <select
                class="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm bg-white"
                [value]="searchFacade.sortBy()"
                (change)="onSortChange($event)"
              >
                @for (option of sortOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
          </div>

          <h1 class="text-xl md:text-2xl font-bold text-charcoal">
            @if (searchFacade.results().length > 0) {
              Tìm thấy <span class="text-honey">{{ searchFacade.results().length }}</span> sản phẩm phù hợp
            } @else {
              Không tìm thấy sản phẩm phù hợp
            }
          </h1>

          @if (activeFilterChips().length > 0) {
            <div class="flex flex-wrap items-center gap-2">
              @for (chip of activeFilterChips(); track chip.label) {
                <button
                  class="text-xs rounded-full border border-honey/50 bg-honey/10 text-charcoal px-3 py-1 hover:bg-honey/20"
                  (click)="removeChip(chip)"
                >
                  {{ chip.label }} ×
                </button>
              }
              <button class="text-xs text-honey font-semibold underline" (click)="clearAllFilters()">Xóa tất cả bộ lọc</button>
            </div>
          }
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <aside class="w-full lg:w-72 flex-shrink-0 space-y-4">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 class="font-bold text-charcoal mb-4 flex items-center gap-2">
                <app-icon name="filter" class="w-4 h-4"></app-icon>
                Bộ lọc
              </h3>

              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-semibold mb-2">Danh mục</h4>
                  <div class="space-y-2 max-h-36 overflow-auto pr-1">
                    @for (category of searchFacade.availableCategories(); track category) {
                      <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          class="accent-honey"
                          [checked]="searchFacade.selectedCategories().includes(category)"
                          (change)="toggleCategory(category)"
                        >
                        <span>{{ category }}</span>
                      </label>
                    }
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold mb-2">Thương hiệu</h4>
                  <div class="space-y-2 max-h-36 overflow-auto pr-1">
                    @for (brand of searchFacade.availableBrands(); track brand) {
                      <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          class="accent-honey"
                          [checked]="searchFacade.selectedBrands().includes(brand)"
                          (change)="toggleBrand(brand)"
                        >
                        <span>{{ brand }}</span>
                      </label>
                    }
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold mb-2">Khoảng giá</h4>
                  <div class="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="number"
                      [value]="minPriceInput()"
                      (input)="onPriceInputChange('min', $event)"
                      placeholder="Từ"
                      class="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
                    >
                    <input
                      type="number"
                      [value]="maxPriceInput()"
                      (input)="onPriceInputChange('max', $event)"
                      placeholder="Đến"
                      class="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
                    >
                  </div>
                  <button class="w-full text-sm bg-charcoal text-white rounded-lg py-2 hover:bg-black" (click)="applyPriceRange()">
                    Áp dụng giá
                  </button>
                  <div class="flex flex-wrap gap-2 mt-2">
                    @for (range of quickPriceRanges; track range.label) {
                      <button
                        class="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-honey/20"
                        (click)="applyQuickPrice(range.min, range.max)"
                      >
                        {{ range.label }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold mb-2">Phong cách</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (style of searchFacade.availableStyles(); track style) {
                      <button
                        class="text-xs px-3 py-1 rounded-full border"
                        [class.border-honey]="searchFacade.selectedStyles().includes(style)"
                        [class.bg-honey]="searchFacade.selectedStyles().includes(style)"
                        [class.border-gray-200]="!searchFacade.selectedStyles().includes(style)"
                        (click)="toggleStyle(style)"
                      >
                        {{ style }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold mb-2">Khác</h4>
                  <label class="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-honey"
                      [checked]="searchFacade.inStockOnly()"
                      (change)="toggleInStockOnly($event)"
                    >
                    <span>Chỉ còn hàng</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-honey"
                      [checked]="searchFacade.onSaleOnly()"
                      (change)="toggleOnSaleOnly($event)"
                    >
                    <span>Đang khuyến mại</span>
                  </label>
                  <div class="flex flex-wrap gap-2 mt-2">
                    @for (rate of [5,4,3]; track rate) {
                      <button
                        class="text-xs px-3 py-1 rounded-full border"
                        [class.border-honey]="searchFacade.ratingGte() === rate"
                        [class.bg-honey]="searchFacade.ratingGte() === rate"
                        [class.border-gray-200]="searchFacade.ratingGte() !== rate"
                        (click)="setRatingGte(searchFacade.ratingGte() === rate ? 0 : rate)"
                      >
                        Từ {{ rate }} sao
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main class="flex-grow">
            @if (searchFacade.isSearching()) {
              <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (_ of [1,2,3,4,5,6,7,8]; track _) {
                  <div class="bg-white rounded-lg p-3 animate-pulse">
                    <div class="w-full aspect-[4/5] bg-gray-200 rounded mb-3"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                }
              </div>
            } @else if (searchFacade.results().length === 0) {
              <div class="bg-white rounded-xl border border-gray-100 p-8">
                <h2 class="text-xl font-bold text-charcoal mb-2">Không có kết quả khớp</h2>
                <p class="text-gray-500 mb-6">Thử từ khóa khác hoặc xóa bớt bộ lọc để mở rộng kết quả.</p>
                <h3 class="font-bold text-charcoal mb-3">Gợi ý sản phẩm nổi bật</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  @for (product of bestSellers(); track product.id) {
                    <div class="border border-gray-100 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                      <img [src]="product.image" class="w-full aspect-[4/5] object-cover rounded mb-2">
                      <p class="text-xs text-gray-500 uppercase">{{ product.category }}</p>
                      <h4 class="font-semibold text-charcoal truncate">{{ product.name }}</h4>
                      <div class="flex items-center justify-between mt-2">
                        <span class="text-honey font-bold text-sm">{{ product.price | currency:'VND':'symbol':'1.0-0' }}</span>
                        <button class="text-xs bg-honey text-charcoal rounded px-2 py-1 font-semibold" (click)="addToCart(product.id)">Thêm</button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            } @else {
              <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (product of searchFacade.results(); track product.id) {
                  <article class="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300">
                    <div class="relative w-full aspect-[4/5] overflow-hidden rounded-t-lg bg-gray-100">
                      <img [src]="product.image" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0">
                      <img [src]="product.hoverImage" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      @if ((product.originalPrice ?? 0) > product.price) {
                        <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded bg-red-500 text-white">SALE</span>
                      }
                      <button
                        (click)="addToCart(product.id)"
                        class="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-charcoal hover:bg-honey hover:text-white transition-colors"
                      >
                        <app-icon name="plus" class="w-5 h-5"></app-icon>
                      </button>
                    </div>
                    <div class="p-4">
                      <p class="text-[11px] text-gray-500 uppercase tracking-wide">{{ product.category }} · {{ product.brand ?? 'BeeShop' }}</p>
                      <h3 class="font-bold text-charcoal truncate">{{ product.name }}</h3>
                      <div class="flex items-center gap-2 mt-1">
                        <p class="text-honey font-bold">{{ product.price | currency:'VND':'symbol':'1.0-0' }}</p>
                        @if ((product.originalPrice ?? 0) > product.price) {
                          <p class="text-xs text-gray-400 line-through">{{ product.originalPrice | currency:'VND':'symbol':'1.0-0' }}</p>
                        }
                      </div>
                      <div class="mt-1 text-xs text-gray-500">
                        ⭐ {{ product.rating ?? 0 }} • {{ product.reviews ?? 0 }} đánh giá
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Hide scrollbar for horizontal scroll */
    .snap-x::-webkit-scrollbar {
      display: none; 
    }
    .snap-x {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly searchFacade = inject(SearchFacade);
  readonly checkoutFacade = inject(CheckoutFacade);

  readonly minPriceInput = signal('');
  readonly maxPriceInput = signal('');

  readonly activeFilterChips = computed(() => {
    const chips: Array<{ type: 'category' | 'brand' | 'style' | 'minPrice' | 'maxPrice' | 'inStock' | 'onSale' | 'rating'; value?: string; label: string }> = [];

    this.searchFacade.selectedCategories().forEach((item) => {
      chips.push({ type: 'category', value: item, label: `Danh mục: ${item}` });
    });
    this.searchFacade.selectedBrands().forEach((item) => {
      chips.push({ type: 'brand', value: item, label: `Thương hiệu: ${item}` });
    });
    this.searchFacade.selectedStyles().forEach((item) => {
      chips.push({ type: 'style', value: item, label: `Phong cách: ${item}` });
    });

    if (this.searchFacade.minPrice() !== null) {
      chips.push({
        type: 'minPrice',
        label: `Giá từ ${Number(this.searchFacade.minPrice()).toLocaleString('vi-VN')}đ`
      });
    }

    if (this.searchFacade.maxPrice() !== null) {
      chips.push({
        type: 'maxPrice',
        label: `Giá đến ${Number(this.searchFacade.maxPrice()).toLocaleString('vi-VN')}đ`
      });
    }

    if (this.searchFacade.inStockOnly()) {
      chips.push({ type: 'inStock', label: 'Chỉ còn hàng' });
    }
    if (this.searchFacade.onSaleOnly()) {
      chips.push({ type: 'onSale', label: 'Đang khuyến mại' });
    }
    if (this.searchFacade.ratingGte() > 0) {
      chips.push({ type: 'rating', label: `Từ ${this.searchFacade.ratingGte()} sao` });
    }

    return chips;
  });

  readonly quickPriceRanges = [
    { label: 'Dưới 200k', min: null, max: 200000 },
    { label: '200k - 500k', min: 200000, max: 500000 },
    { label: 'Trên 500k', min: 500000, max: null }
  ];

  readonly sortOptions: Array<{ label: string; value: SearchSort }> = [
    { label: 'Liên quan nhất', value: 'relevance' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Giá tăng dần', value: 'price-asc' },
    { label: 'Giá giảm dần', value: 'price-desc' },
    { label: 'Đánh giá cao nhất', value: 'rating-desc' }
  ];

  private routeSub?: Subscription;
  private syncingFromRoute = false;

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe((queryParamMap) => {
      this.syncingFromRoute = true;
      this.searchFacade.hydrateFromQueryParams({
        q: queryParamMap.get('q') ?? undefined,
        category: queryParamMap.get('category') ?? undefined,
        brand: queryParamMap.get('brand') ?? undefined,
        style: queryParamMap.get('style') ?? undefined,
        minPrice: queryParamMap.get('minPrice') ?? undefined,
        maxPrice: queryParamMap.get('maxPrice') ?? undefined,
        inStock: queryParamMap.get('inStock') ?? undefined,
        onSale: queryParamMap.get('onSale') ?? undefined,
        ratingGte: queryParamMap.get('ratingGte') ?? undefined,
        sort: queryParamMap.get('sort') ?? undefined
      });

      this.minPriceInput.set(
        this.searchFacade.minPrice() === null ? '' : String(this.searchFacade.minPrice())
      );
      this.maxPriceInput.set(
        this.searchFacade.maxPrice() === null ? '' : String(this.searchFacade.maxPrice())
      );
      this.syncingFromRoute = false;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private syncUrlState(): void {
    if (this.syncingFromRoute) {
      return;
    }

    const queryParams: Params = this.searchFacade.toQueryParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchFacade.setQuery(value);
    this.syncUrlState();
  }

  clearQuery(): void {
    this.searchFacade.clearQuery();
    this.syncUrlState();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SearchSort;
    this.searchFacade.setSortBy(value);
    this.syncUrlState();
  }

  toggleCategory(category: string): void {
    this.searchFacade.toggleCategory(category);
    this.syncUrlState();
  }

  toggleBrand(brand: string): void {
    this.searchFacade.toggleBrand(brand);
    this.syncUrlState();
  }

  toggleStyle(style: string): void {
    this.searchFacade.toggleStyle(style);
    this.syncUrlState();
  }

  toggleInStockOnly(event: Event): void {
    this.searchFacade.setInStockOnly((event.target as HTMLInputElement).checked);
    this.syncUrlState();
  }

  toggleOnSaleOnly(event: Event): void {
    this.searchFacade.setOnSaleOnly((event.target as HTMLInputElement).checked);
    this.syncUrlState();
  }

  setRatingGte(value: number): void {
    this.searchFacade.setRatingGte(value);
    this.syncUrlState();
  }

  onPriceInputChange(type: 'min' | 'max', event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    if (type === 'min') {
      this.minPriceInput.set(rawValue);
    } else {
      this.maxPriceInput.set(rawValue);
    }
  }

  applyPriceRange(): void {
    const min = this.minPriceInput().trim() ? Number(this.minPriceInput()) : null;
    const max = this.maxPriceInput().trim() ? Number(this.maxPriceInput()) : null;

    this.searchFacade.setPriceRange(
      min !== null && Number.isFinite(min) ? min : null,
      max !== null && Number.isFinite(max) ? max : null
    );

    this.minPriceInput.set(
      this.searchFacade.minPrice() === null ? '' : String(this.searchFacade.minPrice())
    );
    this.maxPriceInput.set(
      this.searchFacade.maxPrice() === null ? '' : String(this.searchFacade.maxPrice())
    );

    this.syncUrlState();
  }

  applyQuickPrice(min: number | null, max: number | null): void {
    this.searchFacade.setPriceRange(min, max);
    this.minPriceInput.set(this.searchFacade.minPrice() === null ? '' : String(this.searchFacade.minPrice()));
    this.maxPriceInput.set(this.searchFacade.maxPrice() === null ? '' : String(this.searchFacade.maxPrice()));
    this.syncUrlState();
  }

  removeChip(chip: { type: 'category' | 'brand' | 'style' | 'minPrice' | 'maxPrice' | 'inStock' | 'onSale' | 'rating'; value?: string }): void {
    switch (chip.type) {
      case 'category':
        if (chip.value) this.searchFacade.toggleCategory(chip.value);
        break;
      case 'brand':
        if (chip.value) this.searchFacade.toggleBrand(chip.value);
        break;
      case 'style':
        if (chip.value) this.searchFacade.toggleStyle(chip.value);
        break;
      case 'minPrice':
      case 'maxPrice':
      case 'inStock':
      case 'onSale':
      case 'rating':
        this.searchFacade.removeFilterChip(chip.type);
        break;
      default:
        break;
    }

    this.minPriceInput.set(this.searchFacade.minPrice() === null ? '' : String(this.searchFacade.minPrice()));
    this.maxPriceInput.set(this.searchFacade.maxPrice() === null ? '' : String(this.searchFacade.maxPrice()));
    this.syncUrlState();
  }

  clearAllFilters(): void {
    this.searchFacade.clearAllFilters();
    this.minPriceInput.set('');
    this.maxPriceInput.set('');
    this.syncUrlState();
  }

  addToCart(productId: number): void {
    this.checkoutFacade.addToCart(productId, 1);
  }

  readonly bestSellers = computed(() => this.searchFacade.bestSellerProducts());
}
