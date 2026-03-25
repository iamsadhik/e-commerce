import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../types';
import styles from './Navbar.module.css';

interface NavbarProps {
  cartItems: CartItem[];
}

export function Navbar({ cartItems }: NavbarProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        TeeStore
      </Link>
      <Link to="/cart" className={styles.cartButton}>
        <span className={styles.cartIcon}><ShoppingBag size={22} strokeWidth={1.5} /></span>
        {totalItems > 0 && (
          <span className={styles.badge} key={totalItems}>{totalItems}</span>
        )}
      </Link>
    </nav>
  );
}
