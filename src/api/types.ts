// Common Pagination Types
export interface PageRequest {
  page: number;
  size: number;
  sort?: string[];
  categoryId?: string; // Added filter
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // current page index (0-based)
  first: boolean;
  empty: boolean;
}

// Legacy Types (To be refactored or kept if used)
export interface CreateProductOptionRequest {
  name: string;
  value: string;
  priceAdjustment: number;
  stockQuantity: number;
  displayOrder: number;
}
