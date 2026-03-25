import type { Product } from '../constants';
import type { Filters } from '../types';
import { PRICE_RANGES } from '../constants';

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') return `₹${amount}`;
  return `${currency} ${amount}`;
}

export function searchProducts(allProducts: Product[], query: string): Product[] {
  if (!query.trim()) return allProducts;
  const terms = query.toLowerCase().trim().split(/\s+/);
  return allProducts.filter((product) => {
    const searchable = `${product.name} ${product.color} ${product.type}`.toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}

export function filterProducts(allProducts: Product[], filters: Filters): Product[] {
  return allProducts.filter((product) => {
    if (filters.gender.length > 0 && !filters.gender.includes(product.gender)) return false;
    if (filters.color.length > 0 && !filters.color.includes(product.color)) return false;
    if (filters.type.length > 0 && !filters.type.includes(product.type)) return false;
    if (filters.minPrice !== null && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
    return true;
  });
}

export function parseFiltersFromParams(params: URLSearchParams): Filters {
  const minPriceStr = params.get('minPrice');
  const maxPriceStr = params.get('maxPrice');
  const minPrice = minPriceStr !== null ? Number(minPriceStr) : null;
  const maxPrice = maxPriceStr !== null ? Number(maxPriceStr) : null;

  const priceRange: string[] = [];
  if (minPrice !== null && maxPrice !== null) {
    for (const range of PRICE_RANGES) {
      if (range.min >= minPrice && range.max <= maxPrice) {
        priceRange.push(range.label);
      }
    }
  }

  return {
    gender: params.get('gender')?.split(',').filter(Boolean) ?? [],
    color: params.get('color')?.split(',').filter(Boolean) ?? [],
    priceRange,
    type: params.get('type')?.split(',').filter(Boolean) ?? [],
    minPrice,
    maxPrice,
  };
}

export function filtersToParams(filters: Filters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.gender.length) params.gender = filters.gender.join(',');
  if (filters.color.length) params.color = filters.color.join(',');
  if (filters.type.length) params.type = filters.type.join(',');
  if (filters.minPrice !== null) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== null) params.maxPrice = String(filters.maxPrice);
  return params;
}
