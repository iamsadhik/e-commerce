import styles from './CartSkeleton.module.css';

export function CartSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.shimmerTitle} />
          <div className={styles.shimmerBackLink} />
        </div>

        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={styles.shimmerItem}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.shimmerImage} />
                <div className={styles.shimmerDetails}>
                  <div className={styles.shimmerLine} />
                  <div className={`${styles.shimmerLine} ${styles.shimmerLineShort}`} />
                  <div className={`${styles.shimmerLine} ${styles.shimmerLineXs}`} />
                </div>
                <div className={styles.shimmerActions}>
                  <div className={styles.shimmerQty} />
                  <div className={`${styles.shimmerLine} ${styles.shimmerLineXs}`} />
                  <div className={styles.shimmerRemove} />
                </div>
              </div>
            ))}
          </div>

          <aside className={styles.shimmerSidebar}>
            <div className={styles.shimmerSidebarTitle} />
            <div className={styles.shimmerCouponRow} />
            <div className={styles.shimmerDivider} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.shimmerSummaryRow}>
                <div className={styles.shimmerLine} style={{ width: '40%' }} />
                <div className={styles.shimmerLine} style={{ width: '20%' }} />
              </div>
            ))}
            <div className={styles.shimmerDivider} />
            <div className={styles.shimmerSummaryRow}>
              <div className={styles.shimmerLine} style={{ width: '30%', height: '22px' }} />
              <div className={styles.shimmerLine} style={{ width: '28%', height: '22px' }} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
