export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Filters {
  gender: string[];
  color: string[];
  priceRange: string[];
  type: string[];
  minPrice: number | null;
  maxPrice: number | null;
}
