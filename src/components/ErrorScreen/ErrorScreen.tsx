import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorScreen.module.css';

interface ErrorScreenProps {
  message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <div className={styles.container}>
      <AlertTriangle size={40} strokeWidth={1.5} className={styles.icon} />
      <h2 className={styles.heading}>Something went wrong</h2>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        <RefreshCw size={14} strokeWidth={2} /> Try Again
      </button>
    </div>
  );
}
