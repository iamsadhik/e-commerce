import styles from './ProductListingSkeleton.module.css';

export function ProductListingSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <aside>
          <div className={styles.shimmerSidebar}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={styles.shimmerSidebarLine}
                style={{ width: i % 3 === 0 ? '50%' : '80%', animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        </aside>
        <div className={styles.mainArea}>
          <div className={styles.shimmerSearch} />
          <div className={styles.shimmerResultsInfo} />
          <div className={styles.grid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={styles.shimmerCard} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={styles.shimmerImage} />
                <div className={styles.shimmerBody}>
                  <div className={styles.shimmerLine} />
                  <div className={`${styles.shimmerLine} ${styles.shimmerLineXs}`} />
                  <div className={styles.shimmerPriceRow}>
                    <div className={styles.shimmerPrice} />
                    <div className={styles.shimmerButton} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
