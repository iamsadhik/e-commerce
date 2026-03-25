import { Trash2 } from 'lucide-react';
import type { Product } from '../../constants';
import { formatCurrency } from '../../utils';
import styles from './CartItemCard.module.css';

interface CartItemCardProps {
  product: Product & { cartQty: number };
  error?: string;
  index: number;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItemCard({ product, error, index, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  return (
    <div
      className={styles.cartItem}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <img src={product.imageURL} alt={product.name} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{product.name}</h3>
        <p className={styles.itemMeta}>{product.gender} · {product.type} · {product.color}</p>
        <span className={styles.itemPrice}>
          {formatCurrency(product.price, product.currency)}
        </span>
        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}
      </div>
      <div className={styles.itemActions}>
        <div className={styles.quantityControls}>
          <button className={styles.qtyButton} onClick={() => onDecrease(product.id)}>
            −
          </button>
          <span className={styles.qtyValue}>{product.cartQty}</span>
          <button className={styles.qtyButton} onClick={() => onIncrease(product.id)}>
            +
          </button>
        </div>
        <span className={styles.itemSubtotal}>
          {formatCurrency(product.price * product.cartQty, product.currency)}
        </span>
        <button className={styles.deleteButton} onClick={() => onRemove(product.id)}>
          <Trash2 size={14} strokeWidth={1.5} /> Remove
        </button>
      </div>
    </div>
  );
}
