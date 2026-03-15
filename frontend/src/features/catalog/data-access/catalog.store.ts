import { Injectable, signal } from '@angular/core';
import { Category, Product } from '@/core/models';
import {
  MOCK_CATEGORIES,
  MOCK_CATEGORY_PRODUCTS,
  MOCK_FLASH_SALE_PRODUCTS,
  MOCK_NEW_ARRIVALS_PRODUCTS,
  MOCK_NEW_COLLECTION_PRODUCTS,
  MOCK_TRENDING_PRODUCTS
} from '@/core/mock-data/ecommerce.mock';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  readonly categories = signal<Category[]>(MOCK_CATEGORIES);
  readonly categoryProducts = signal<Product[]>(MOCK_CATEGORY_PRODUCTS);
  readonly trendingProducts = signal<Product[]>(MOCK_TRENDING_PRODUCTS);
  readonly flashSaleProducts = signal<Product[]>(MOCK_FLASH_SALE_PRODUCTS);
  readonly newCollectionProducts = signal<Product[]>(MOCK_NEW_COLLECTION_PRODUCTS);
  readonly newArrivals = signal<Product[]>(MOCK_NEW_ARRIVALS_PRODUCTS);
}
