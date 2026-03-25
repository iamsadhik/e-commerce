import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../constants';
import type { CartItem } from '../../types';
import { CartItemCard } from '../../components/CartItemCard/CartItemCard';
import { BillingSummary } from '../../components/BillingSummary/BillingSummary';
import { CartSkeleton } from '../../components/CartSkeleton/CartSkeleton';
import styles from './CartPage.module.css';

interface CartPageProps {
  products: Product[];
  loading: boolean;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function CartPage({ products, loading, cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<number, string>>({});

  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, cartQty: item.quantity } : null;
    })
    .filter(Boolean) as (typeof products[number] & { cartQty: number })[];

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.cartQty, 0);
  const totalItems = cartProducts.reduce((sum, p) => sum + p.cartQty, 0);

  const handleIncrease = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!product || !cartItem) return;

    if (cartItem.quantity >= product.quantity) {
      setErrors((prev) => ({
        ...prev,
        [productId]: `Only ${product.quantity} available in stock.`,
      }));
      setTimeout(() => {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }, 3000);
      return;
    }
    onUpdateQuantity(productId, cartItem.quantity + 1);
  };

  const handleDecrease = (productId: number) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      onRemoveItem(productId);
    } else {
      onUpdateQuantity(productId, cartItem.quantity - 1);
    }
  };

  const handleCheckout = (details: { totalAmount: number; totalItems: number; discount: number }) => {
    navigate('/payment-success', { state: details });
  };

  if (loading && cartItems.length > 0) {
    return <CartSkeleton />;
  }

  if (cartProducts.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.emptyCart}>
            <div className={styles.emptyEmoji}><ShoppingBag size={56} strokeWidth={1} /></div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>Looks like you haven't added any items yet.</p>
            <Link to="/" className={styles.shopButton}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <Link to="/" className={styles.backLink}>
            ← Continue Shopping
          </Link>
        </div>

        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {cartProducts.map((product, i) => (
              <CartItemCard
                key={product.id}
                product={product}
                error={errors[product.id]}
                index={i}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={onRemoveItem}
              />
            ))}
          </div>

          <aside className={styles.cartSidebar}>
            <BillingSummary subtotal={subtotal} totalItems={totalItems} onCheckout={handleCheckout} />
          </aside>
        </div>
      </div>
    </div>
  );
}
