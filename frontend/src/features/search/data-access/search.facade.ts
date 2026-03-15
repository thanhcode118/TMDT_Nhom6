import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Params } from '@angular/router';
import { CatalogStore } from '@/features/catalog/data-access/catalog.store';
import { Product } from '@/core/models';

export type SearchSort = 'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private readonly catalogStore = inject(CatalogStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly query = signal('');
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedBrands = signal<string[]>([]);
  readonly selectedStyles = signal<string[]>([]);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly inStockOnly = signal(false);
  readonly onSaleOnly = signal(false);
  readonly ratingGte = signal(0);
  readonly sortBy = signal<SearchSort>('relevance');
  readonly isSearching = signal(false);
  private readonly fallbackKeywords = [
    'den ngu',
    'den tha tran',
    'go decor',
    'nen thom',
    'khay go',
    'tranh treo tuong',
    'guong trang tri',
    'tham phong khach'
  ];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(
      () => {
        this.query();
        this.selectedCategories();
        this.selectedBrands();
        this.selectedStyles();
        this.minPrice();
        this.maxPrice();
        this.inStockOnly();
        this.onSaleOnly();
        this.ratingGte();
        this.sortBy();

        this.isSearching.set(true);
        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(() => {
          this.isSearching.set(false);
        }, 180);
      },
      { allowSignalWrites: true }
    );

    this.destroyRef.onDestroy(() => {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
    });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  private toBrand(product: Product): string {
    return (product.brand ?? 'BeeShop').trim();
  }

  private isInStock(product: Product): boolean {
    if (typeof product.inStock === 'boolean') {
      return product.inStock;
    }
    return product.tag !== 'Sold Out';
  }

  private isOnSale(product: Product): boolean {
    return (product.originalPrice ?? 0) > product.price;
  }

  private getRelevanceScore(product: Product, normalizedQuery: string): number {
    if (!normalizedQuery) {
      return 0;
    }

    const name = this.normalize(product.name);
    const sku = this.normalize(product.sku);
    const category = this.normalize(product.category);
    const brand = this.normalize(this.toBrand(product));
    const style = this.normalize(product.style ?? '');
    const material = this.normalize(product.material ?? '');

    let score = 0;
    if (name === normalizedQuery) score += 120;
    if (name.startsWith(normalizedQuery)) score += 75;
    if (name.includes(normalizedQuery)) score += 55;
    if (sku === normalizedQuery) score += 100;
    if (sku.includes(normalizedQuery)) score += 50;
    if (brand.includes(normalizedQuery)) score += 30;
    if (category.includes(normalizedQuery)) score += 22;
    if (style.includes(normalizedQuery)) score += 12;
    if (material.includes(normalizedQuery)) score += 10;

    score += (product.rating ?? 0) * 3;
    score += Math.min(product.reviews ?? 0, 150) * 0.15;
    if (this.isInStock(product)) score += 3;

    return score;
  }

  private parseList(value?: string): string[] {
    if (!value) {
      return [];
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private toNumber(value?: string): number | null {
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return parsed;
  }

  private toBoolean(value?: string): boolean {
    return value === 'true' || value === '1';
  }

  readonly allProducts = computed(() => {
    const all = [
      ...this.catalogStore.categoryProducts(),
      ...this.catalogStore.newCollectionProducts(),
      ...this.catalogStore.trendingProducts(),
      ...this.catalogStore.flashSaleProducts(),
      ...this.catalogStore.newArrivals()
    ];

    const uniqueById = new Map<number, Product>();
    all.forEach((product) => {
      if (product.isActive) {
        uniqueById.set(product.id, product);
      }
    });
    return Array.from(uniqueById.values()).sort((a, b) => a.id - b.id);
  });

  readonly availableCategories = computed(() => {
    return Array.from(new Set(this.allProducts().map((item) => item.category))).sort((a, b) => a.localeCompare(b));
  });

  readonly availableBrands = computed(() => {
    return Array.from(new Set(this.allProducts().map((item) => this.toBrand(item)))).sort((a, b) => a.localeCompare(b));
  });

  readonly availableStyles = computed(() => {
    return Array.from(
      new Set(
        this.allProducts()
          .map((item) => item.style)
          .filter((style): style is string => !!style)
      )
    ).sort((a, b) => a.localeCompare(b));
  });

  readonly hasActiveFilters = computed(() => {
    return (
      this.selectedCategories().length > 0 ||
      this.selectedBrands().length > 0 ||
      this.selectedStyles().length > 0 ||
      this.minPrice() !== null ||
      this.maxPrice() !== null ||
      this.inStockOnly() ||
      this.onSaleOnly() ||
      this.ratingGte() > 0
    );
  });

  readonly filteredProducts = computed(() => {
    const q = this.normalize(this.query().trim());
    return this.allProducts().filter((product) => {
      const text = this.normalize(
        `${product.name} ${product.sku} ${product.category} ${this.toBrand(product)} ${product.style ?? ''} ${product.material ?? ''} ${product.color ?? ''}`
      );

      if (q && !text.includes(q)) {
        return false;
      }

      if (this.selectedCategories().length > 0 && !this.selectedCategories().includes(product.category)) {
        return false;
      }

      if (this.selectedBrands().length > 0 && !this.selectedBrands().includes(this.toBrand(product))) {
        return false;
      }

      if (
        this.selectedStyles().length > 0 &&
        (!product.style || !this.selectedStyles().includes(product.style))
      ) {
        return false;
      }

      if (this.minPrice() !== null && product.price < this.minPrice()!) {
        return false;
      }

      if (this.maxPrice() !== null && product.price > this.maxPrice()!) {
        return false;
      }

      if (this.inStockOnly() && !this.isInStock(product)) {
        return false;
      }

      if (this.onSaleOnly() && !this.isOnSale(product)) {
        return false;
      }

      if ((product.rating ?? 0) < this.ratingGte()) {
        return false;
      }

      return true;
    });
  });

  readonly results = computed(() => {
    const list = [...this.filteredProducts()];
    const q = this.normalize(this.query().trim());

    switch (this.sortBy()) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price || b.id - a.id);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price || b.id - a.id);
      case 'rating-desc':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviews ?? 0) - (a.reviews ?? 0));
      case 'newest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.id - a.id
        );
      default:
        return list.sort((a, b) => {
          const scoreB = this.getRelevanceScore(b, q);
          const scoreA = this.getRelevanceScore(a, q);
          if (scoreB !== scoreA) return scoreB - scoreA;
          if (this.isInStock(a) !== this.isInStock(b)) return this.isInStock(b) ? 1 : -1;
          return (b.reviews ?? 0) - (a.reviews ?? 0) || b.id - a.id;
        });
    }
  });

  readonly suggestions = computed(() => {
    const q = this.normalize(this.query().trim());
    if (!q) {
      return [];
    }
    return this.results().slice(0, 6);
  });

  readonly keywordPool = computed(() => {
    const rawKeywords = [
      ...this.fallbackKeywords,
      ...this.allProducts().map((item) => item.name),
      ...this.allProducts().map((item) => item.category),
      ...this.allProducts().map((item) => this.toBrand(item)),
      ...this.allProducts().map((item) => item.style ?? ''),
      ...this.allProducts().map((item) => item.material ?? '')
    ].filter(Boolean);

    const uniqueKeywordMap = new Map<string, string>();
    rawKeywords.forEach((keyword) => {
      const normalized = this.normalize(keyword);
      if (normalized && !uniqueKeywordMap.has(normalized)) {
        uniqueKeywordMap.set(normalized, keyword.trim());
      }
    });

    return Array.from(uniqueKeywordMap.entries()).map(([normalized, keyword]) => ({
      normalized,
      keyword
    }));
  });

  readonly keywordSuggestions = computed(() => {
    const q = this.normalize(this.query().trim());
    const allKeywords = this.keywordPool();

    if (!q) {
      return allKeywords.slice(0, 8).map((item) => item.keyword);
    }

    return allKeywords
      .filter((item) => item.normalized.includes(q) && item.normalized !== q)
      .sort((a, b) => {
        const aStarts = a.normalized.startsWith(q) ? 0 : 1;
        const bStarts = b.normalized.startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.keyword.length - b.keyword.length;
      })
      .slice(0, 8)
      .map((item) => item.keyword);
  });

  readonly bestSellerProducts = computed(() => {
    return this.allProducts()
      .filter((product) => (product.rating ?? 0) >= 4.7 || product.tag === 'Best Seller')
      .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      .slice(0, 12);
  });

  setQuery(query: string): void {
    this.query.set(query);
  }

  applySuggestedKeyword(keyword: string): void {
    this.query.set(keyword);
  }

  setSortBy(sortBy: SearchSort): void {
    this.sortBy.set(sortBy);
  }

  toggleCategory(category: string): void {
    this.selectedCategories.update((list) =>
      list.includes(category) ? list.filter((item) => item !== category) : [...list, category]
    );
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.update((list) =>
      list.includes(brand) ? list.filter((item) => item !== brand) : [...list, brand]
    );
  }

  toggleStyle(style: string): void {
    this.selectedStyles.update((list) =>
      list.includes(style) ? list.filter((item) => item !== style) : [...list, style]
    );
  }

  setPriceRange(minPrice: number | null, maxPrice: number | null): void {
    const normalizedMin = typeof minPrice === 'number' && Number.isFinite(minPrice) ? Math.max(minPrice, 0) : null;
    const normalizedMax = typeof maxPrice === 'number' && Number.isFinite(maxPrice) ? Math.max(maxPrice, 0) : null;

    if (normalizedMin !== null && normalizedMax !== null && normalizedMin > normalizedMax) {
      this.minPrice.set(normalizedMax);
      this.maxPrice.set(normalizedMin);
      return;
    }

    this.minPrice.set(normalizedMin);
    this.maxPrice.set(normalizedMax);
  }

  setInStockOnly(enabled: boolean): void {
    this.inStockOnly.set(enabled);
  }

  setOnSaleOnly(enabled: boolean): void {
    this.onSaleOnly.set(enabled);
  }

  setRatingGte(value: number): void {
    this.ratingGte.set(Math.max(0, Math.min(5, value)));
  }

  removeFilterChip(type: 'category' | 'brand' | 'style' | 'minPrice' | 'maxPrice' | 'inStock' | 'onSale' | 'rating') {
    switch (type) {
      case 'minPrice':
        this.minPrice.set(null);
        break;
      case 'maxPrice':
        this.maxPrice.set(null);
        break;
      case 'inStock':
        this.inStockOnly.set(false);
        break;
      case 'onSale':
        this.onSaleOnly.set(false);
        break;
      case 'rating':
        this.ratingGte.set(0);
        break;
      default:
        break;
    }
  }

  clearAllFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.selectedStyles.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.inStockOnly.set(false);
    this.onSaleOnly.set(false);
    this.ratingGte.set(0);
    this.sortBy.set('relevance');
  }

  toQueryParams(): Params {
    const queryParams: Params = {};
    const query = this.query().trim();

    if (query) queryParams.q = query;
    if (this.selectedCategories().length) queryParams.category = this.selectedCategories().join(',');
    if (this.selectedBrands().length) queryParams.brand = this.selectedBrands().join(',');
    if (this.selectedStyles().length) queryParams.style = this.selectedStyles().join(',');
    if (this.minPrice() !== null) queryParams.minPrice = this.minPrice();
    if (this.maxPrice() !== null) queryParams.maxPrice = this.maxPrice();
    if (this.inStockOnly()) queryParams.inStock = 'true';
    if (this.onSaleOnly()) queryParams.onSale = 'true';
    if (this.ratingGte() > 0) queryParams.ratingGte = this.ratingGte();
    if (this.sortBy() !== 'relevance') queryParams.sort = this.sortBy();

    return queryParams;
  }

  hydrateFromQueryParams(params: Record<string, string | undefined>): void {
    this.query.set((params.q ?? '').trim());
    this.selectedCategories.set(this.parseList(params.category));
    this.selectedBrands.set(this.parseList(params.brand));
    this.selectedStyles.set(this.parseList(params.style));

    const minPrice = this.toNumber(params.minPrice);
    const maxPrice = this.toNumber(params.maxPrice);
    this.setPriceRange(minPrice, maxPrice);

    this.inStockOnly.set(this.toBoolean(params.inStock));
    this.onSaleOnly.set(this.toBoolean(params.onSale));

    const rating = this.toNumber(params.ratingGte);
    this.ratingGte.set(rating ? Math.max(0, Math.min(5, Math.floor(rating))) : 0);

    const sort = params.sort as SearchSort | undefined;
    const allowedSort: SearchSort[] = ['relevance', 'newest', 'price-asc', 'price-desc', 'rating-desc'];
    this.sortBy.set(sort && allowedSort.includes(sort) ? sort : 'relevance');
  }

  clearQuery(): void {
    this.query.set('');
  }
}
