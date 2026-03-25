import { useState } from 'react';
import type { Product } from '../../constants';
import type { CartItem } from '../../types';
import { formatCurrency } from '../../utils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  cartItems: CartItem[];
  onAddToCart: (productId: number) => void;
  index: number;
}

export function ProductCard({ product, cartItems, onAddToCart, index }: ProductCardProps) {
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const cartItem = cartItems.find((item) => item.productId === product.id);
  const cartQty = cartItem?.quantity ?? 0;
  const isOutOfStock = product.quantity === 0;
  const remaining = product.quantity - cartQty;

  const handleAdd = () => {
    if (remaining <= 0) {
      setError(`Sorry, only ${product.quantity} available and you already have ${cartQty} in cart.`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    setAdded(true);
    onAddToCart(product.id);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.imageWrapper}>
        <img src={product.imageURL} alt={product.name} className={styles.image} loading="lazy" />
        <span className={styles.typeBadge}>{product.type}</span>
        {isOutOfStock && <div className={styles.outOfStock}>Out of Stock</div>}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.meta}>{product.gender} · {product.type}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(product.price, product.currency)}</span>
          <button
            className={`${styles.addButton} ${added ? styles.successFeedback : ''}`}
            onClick={handleAdd}
            disabled={isOutOfStock || added}
          >
            {added ? '✓ Added' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
        {remaining > 0 && remaining <= 3 && (
          <p className={`${styles.quantityInfo} ${styles.lowStock}`}>Only {remaining} left!</p>
        )}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  );
}
