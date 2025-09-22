import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import { ErrorIcon } from './icons';
import styles from './GlobalError.module.scss';

export const GlobalError: React.FC = observer(() => {
  if (!fileStore.error) {
    return null;
  }

  return (
    <div className={styles.globalError}>
      <div className={styles.errorContent}>
        <ErrorIcon />
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