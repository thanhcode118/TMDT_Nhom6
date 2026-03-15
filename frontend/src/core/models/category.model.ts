export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
  parentCategoryId?: number;
  image?: string;
  isActive: boolean;
}
