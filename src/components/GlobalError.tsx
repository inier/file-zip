import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import styles from './GlobalError.module.scss';

export const GlobalError: React.FC = observer(() => {
  if (!fileStore.error) {
    return null;
  }

  return (
    <div className={styles.globalError}>
      <div className={styles.errorContent}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="9"
            x2="9"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="9"
            y1="9"
            x2="15"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        {fileStore.error}
        <button 
          className={styles.errorClose}
          onClick={() => fileStore.setError(null)}
        >
          ×
        </button>
      </div>
    </div>
  );
});