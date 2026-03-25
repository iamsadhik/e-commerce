import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SearchBar, FilterPanel, ProductCard, ProductListingSkeleton } from '../../components';
import type { Product } from '../../constants';
import type { CartItem, Filters } from '../../types';
import { searchProducts, filterProducts, parseFiltersFromParams, filtersToParams } from '../../utils';
import styles from './ProductListingPage.module.css';

interface ProductListingPageProps {
  products: Product[];
  loading: boolean;
  cartItems: CartItem[];
  onAddToCart: (productId: number) => void;
}

export function ProductListingPage({ products, loading, cartItems, onAddToCart }: ProductListingPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const filters: Filters = parseFiltersFromParams(searchParams);

  const handleSearch = (newQuery: string) => {
    const params: Record<string, string> = {};
    if (newQuery.trim()) params.q = newQuery.trim();
    const filterParams = filtersToParams(filters);
    setSearchParams({ ...params, ...filterParams });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Filters) => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    const filterParams = filtersToParams(newFilters);
    setSearchParams({ ...params, ...filterParams });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    const searched = searchProducts(products, query);
    return filterProducts(searched, filters);
  }, [query, filters, products]);

  if (loading) {
    return <ProductListingSkeleton />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </aside>
        <div className={styles.mainArea}>
          <SearchBar initialQuery={query} onSearch={handleSearch} />
          <div className={styles.resultsInfo}>
            <span className={styles.resultCount}>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>
          </div>
          <div className={styles.grid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartItems={cartItems}
                  onAddToCart={onAddToCart}
                  index={i}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyEmoji}><Search size={48} strokeWidth={1} /></div>
                <h2 className={styles.emptyTitle}>No products found</h2>
                <p className={styles.emptyText}>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
