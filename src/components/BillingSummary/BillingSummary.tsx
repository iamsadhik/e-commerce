import { useState, useEffect } from 'react';
import { Tag, Truck, X, CreditCard } from 'lucide-react';
import { COUPONS, TAX_RATE, SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from '../../constants';
import type { Coupon } from '../../constants';
import { formatCurrency } from '../../utils';
import styles from './BillingSummary.module.css';

interface BillingSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout: (details: { totalAmount: number; totalItems: number; discount: number }) => void;
}

export function BillingSummary({ subtotal, totalItems, onCheckout }: BillingSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    if (appliedCoupon && subtotal < appliedCoupon.minOrder) {
      setAppliedCoupon(null);
      setCouponSuccess('');
      setCouponError(
        `Coupon "${appliedCoupon.code}" removed — minimum order of ${formatCurrency(appliedCoupon.minOrder, 'INR')} not met.`
      );
    }
  }, [subtotal, appliedCoupon]);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round(subtotal * appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  const afterDiscount = subtotal - discount;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(afterDiscount * TAX_RATE);
  const totalAmount = afterDiscount + shipping + tax;

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const found = COUPONS.find((c) => c.code === trimmed);
    if (!found) {
      setCouponError('Invalid coupon code. Try TEE10, FLAT50, or SAVE20.');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order of ${formatCurrency(found.minOrder, 'INR')} required for this coupon.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponSuccess(`"${found.code}" applied — ${found.label}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  return (
    <div className={styles.summary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>

      <div className={styles.couponSection}>
        {appliedCoupon ? (
          <div className={styles.couponApplied}>
            <div className={styles.couponAppliedInfo}>
              <span className={styles.couponTag}><Tag size={14} strokeWidth={1.5} /> {appliedCoupon.code}</span>
              <span className={styles.couponDesc}>{appliedCoupon.label}</span>
            </div>
            <button className={styles.couponRemove} onClick={handleRemoveCoupon}><X size={14} strokeWidth={2} /></button>
          </div>
        ) : (
          <>
            <div className={styles.couponInputRow}>
              <input
                type="text"
                className={styles.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button className={styles.couponButton} onClick={handleApplyCoupon}>Apply</button>
            </div>
            {couponError && <p className={styles.couponError}>{couponError}</p>}
            <p className={styles.couponHint}>Try: TEE10, FLAT50, SAVE20</p>
          </>
        )}
        {couponSuccess && <p className={styles.couponSuccessMsg}>{couponSuccess}</p>}
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryRow}>
        <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
        <span>{formatCurrency(subtotal, 'INR')}</span>
      </div>

      {discount > 0 && (
        <div className={`${styles.summaryRow} ${styles.discountRow}`}>
          <span>Discount ({appliedCoupon?.code})</span>
          <span>−{formatCurrency(discount, 'INR')}</span>
        </div>
      )}

      <div className={styles.summaryRow}>
        <span>Shipping</span>
        {shipping === 0 ? (
          <span className={styles.freeShipping}>FREE</span>
        ) : (
          <span>{formatCurrency(shipping, 'INR')}</span>
        )}
      </div>

      {shipping === 0 && (
        <p className={styles.shippingNote}><Truck size={14} strokeWidth={1.5} /> You've unlocked free shipping!</p>
      )}
      {shipping > 0 && (
        <p className={styles.shippingNote}>
          Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal, 'INR')} more for free shipping
        </p>
      )}

      <div className={styles.summaryRow}>
        <span>Tax (5% GST)</span>
        <span>{formatCurrency(tax, 'INR')}</span>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.totalRow}>
        <span>Total</span>
        <span className={styles.totalAmount}>{formatCurrency(totalAmount, 'INR')}</span>
      </div>

      {discount > 0 && (
        <p className={styles.savingsNote}>You're saving {formatCurrency(discount, 'INR')} on this order!</p>
      )}

      <div className={styles.paymentMethod}>
        <span className={styles.paymentLabel}>Payment Method</span>
        <span className={styles.paymentValue}>Cash on Delivery (COD)</span>
      </div>

      <button
        className={styles.checkoutButton}
        onClick={() => onCheckout({ totalAmount, totalItems, discount })}
      >
        <CreditCard size={18} strokeWidth={2} /> Place Order — {formatCurrency(totalAmount, 'INR')}
      </button>
    </div>
  );
}
