import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@/core/models';
import { MOCK_CATEGORY_PRODUCTS, MOCK_NEW_COLLECTION_PRODUCTS } from '@/core/mock-data/ecommerce.mock';

interface ProductReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const REVIEWS: ProductReview[] = [
  { id: 1, productId: 101, author: 'Lan Anh', rating: 5, comment: 'Chất liệu đẹp, đóng gói rất kỹ.', createdAt: '2026-03-09' },
  { id: 2, productId: 101, author: 'Huy', rating: 4, comment: 'Màu sắc đúng như mô tả.', createdAt: '2026-03-11' }
];

@Injectable({ providedIn: 'root' })
export class ProductDetailFacade {
  private readonly allProducts: Product[] = [...MOCK_CATEGORY_PRODUCTS, ...MOCK_NEW_COLLECTION_PRODUCTS];
  private readonly selectedProductId = signal<number>(101);
  private readonly reviewsSignal = signal<ProductReview[]>(REVIEWS);

  readonly selectedProduct = computed(() => {
    return this.allProducts.find((p) => p.id === this.selectedProductId()) ?? this.allProducts[0];
  });

  readonly productImages = computed(() => {
    const product = this.selectedProduct();
    return [product.image, product.hoverImage, product.image, product.hoverImage];
  });

  readonly reviews = computed(() => {
    return this.reviewsSignal().filter((item) => item.productId === this.selectedProduct().id);
  });

  selectProductById(id: number): void {
    this.selectedProductId.set(id);
  }

  addComment(author: string, rating: number, comment: string): void {
    this.reviewsSignal.update((list) => [
      {
        id: Date.now(),
        productId: this.selectedProduct().id,
        author,
        rating,
        comment,
        createdAt: new Date().toISOString().split('T')[0]
      },
      ...list
    ]);
  }
}
