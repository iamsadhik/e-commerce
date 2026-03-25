import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Filters } from '../../types';
import { GENDERS, COLORS, TYPES, PRICE_RANGES } from '../../constants';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (sheetOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10) * -1);
      }
    };
  }, [sheetOpen]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    if (category === 'priceRange') {
      const current = filters.priceRange;
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      let minPrice: number | null = null;
      let maxPrice: number | null = null;
      if (updated.length > 0) {
        for (const label of updated) {
          const range = PRICE_RANGES.find((r) => r.label === label);
          if (!range) continue;
          if (minPrice === null || range.min < minPrice) minPrice = range.min;
          if (maxPrice === null || range.max > maxPrice) maxPrice = range.max;
        }
      }

      onFilterChange({ ...filters, priceRange: updated, minPrice, maxPrice });
      return;
    }

    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  const clearAll = () => {
    onFilterChange({ gender: [], color: [], priceRange: [], type: [], minPrice: null, maxPrice: null });
  };

  const hasFilters = filters.gender.length > 0 || filters.color.length > 0 || filters.priceRange.length > 0 || filters.type.length > 0;
  const activeCount = filters.gender.length + filters.color.length + filters.priceRange.length + filters.type.length;

    const filterBody = (
    <>
      <div className={styles.filterGroup}>
        <div className={styles.filterGroupTitle}>Gender</div>
        {GENDERS.map((gender) => (
          <div
            key={gender}
            className={styles.filterOption}
            onClick={() => toggleFilter('gender', gender)}
          >
            <div className={`${styles.checkbox} ${filters.gender.includes(gender) ? styles.checked : ''}`}>
              <span className={`${styles.checkmark} ${filters.gender.includes(gender) ? styles.visible : ''}`}>✓</span>
            </div>
            <span className={styles.filterLabel}>{gender}</span>
          </div>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterGroupTitle}>Colour</div>
        {COLORS.map((color) => (
          <div
            key={color}
            className={styles.filterOption}
            onClick={() => toggleFilter('color', color)}
          >
            <div className={`${styles.checkbox} ${filters.color.includes(color) ? styles.checked : ''}`}>
              <span className={`${styles.checkmark} ${filters.color.includes(color) ? styles.visible : ''}`}>✓</span>
            </div>
            <span className={styles.filterLabel}>{color}</span>
          </div>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterGroupTitle}>Type</div>
        {TYPES.map((type) => (
          <div
            key={type}
            className={styles.filterOption}
            onClick={() => toggleFilter('type', type)}
          >
            <div className={`${styles.checkbox} ${filters.type.includes(type) ? styles.checked : ''}`}>
              <span className={`${styles.checkmark} ${filters.type.includes(type) ? styles.visible : ''}`}>✓</span>
            </div>
            <span className={styles.filterLabel}>{type}</span>
          </div>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.filterGroupTitle}>Price Range</div>
        {PRICE_RANGES.map((range) => (
          <div
            key={range.label}
            className={styles.filterOption}
            onClick={() => toggleFilter('priceRange', range.label)}
          >
            <div className={`${styles.checkbox} ${filters.priceRange.includes(range.label) ? styles.checked : ''}`}>
              <span className={`${styles.checkmark} ${filters.priceRange.includes(range.label) ? styles.visible : ''}`}>✓</span>
            </div>
            <span className={styles.filterLabel}>{range.label}</span>
          </div>
        ))}
      </div>

      {hasFilters && (
        <button className={styles.clearButton} onClick={clearAll}>
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <>
      <div className={styles.filterPanel}>
        <h3 className={styles.filterTitle}>Filters</h3>
        {filterBody}
      </div>

      <button className={styles.filterFab} onClick={() => setSheetOpen(true)}>
        <SlidersHorizontal size={22} strokeWidth={2.5} />
        {activeCount > 0 && (
          <span className={styles.fabBadge} key={activeCount}>{activeCount}</span>
        )}
      </button>

      <div
        className={sheetOpen ? styles.overlayVisible : styles.overlay}
        onClick={() => setSheetOpen(false)}
      />

      <div className={`${styles.bottomSheet} ${sheetOpen ? styles.bottomSheetOpen : ''}`}>
        <div className={styles.sheetHandle}>
          <div className={styles.sheetHandleBar} />
        </div>
        <div className={styles.sheetHeader}>
          <span className={styles.sheetTitle}>
            Filters {activeCount > 0 && `(${activeCount})`}
          </span>
          <button className={styles.sheetClose} onClick={() => setSheetOpen(false)}>✕</button>
        </div>
        <div className={styles.sheetBody}>
          {filterBody}
        </div>
      </div>
    </>
  );
}
