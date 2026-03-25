import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import { CheckCircle, ShoppingBag, ArrowLeft, Banknote } from 'lucide-react';
import celebrationData from '../../assets/celebration.json';
import { formatCurrency } from '../../utils';
import styles from './PaymentSuccessPage.module.css';

interface PaymentSuccessPageProps {
  onClearCart: () => void;
}

interface LocationState {
  totalAmount?: number;
  totalItems?: number;
  discount?: number;
}

export function PaymentSuccessPage({ onClearCart }: PaymentSuccessPageProps) {
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const { totalAmount = 0, totalItems = 0, discount = 0 } = state;

  const { View: LottieView } = useLottie({
    animationData: celebrationData,
    loop: false,
    autoplay: true,
  });

  const orderId = useMemo(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'TS-';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }, []);

  useEffect(() => {
    onClearCart();
  }, [onClearCart]);

  const confettiDots = useMemo(() => {
    const colors = ['#c8a97e', '#4ade80', '#8b5cf6', '#3b82f6', '#ef4444', '#eab308'];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 1.5}s`,
      duration: `${1.5 + Math.random() * 1.5}s`,
    }));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {confettiDots.map((dot) => (
          <div
            key={dot.id}
            className={styles.confettiDot}
            style={{
              left: dot.left,
              top: 0,
              width: dot.size,
              height: dot.size,
              background: dot.color,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}

        <div className={styles.lottieWrapper}>
          {LottieView}
        </div>

        <div className={styles.successIcon}>
          <CheckCircle size={24} strokeWidth={1.5} />
        </div>

        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.subtitle}>
          Thank you for your purchase. Your order has been placed and will be delivered soon.
        </p>

        <div className={styles.orderDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Items Ordered</span>
            <span className={styles.detailValue}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Payment Method</span>
            <span className={styles.paymentBadge}>
              <Banknote size={14} strokeWidth={1.5} /> Cash on Delivery
            </span>
          </div>
          {discount > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>You Saved</span>
              <span className={styles.detailValue} style={{ color: '#4ade80' }}>
                {formatCurrency(discount, 'INR')}
              </span>
            </div>
          )}
          <div className={styles.divider} />
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Total Paid</span>
            <span className={styles.detailValueGold}>{formatCurrency(totalAmount, 'INR')}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            <ShoppingBag size={16} strokeWidth={2} /> Continue Shopping
          </Link>
          <Link to="/cart" className={styles.secondaryButton}>
            <ArrowLeft size={14} strokeWidth={2} /> Back to Cart
          </Link>
        </div>

        <p className={styles.orderId}>
          Order ID: <span className={styles.orderIdCode}>{orderId}</span>
        </p>
      </div>
    </div>
  );
}
