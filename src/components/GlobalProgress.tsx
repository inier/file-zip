import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import styles from './GlobalProgress.module.scss';

export const GlobalProgress: React.FC = observer(() => {
  if (!fileStore.isProcessing) {
    return null;
  }

  return (
    <div className={styles.globalProgress}>
      <div className={styles.progressContent}>
        <div className={styles.progressText}>
          {fileStore.currentOperation}
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${fileStore.progress}%` }}
          ></div>
        </div>
        <div className={styles.progressPercent}>
          {Math.round(fileStore.progress)}%
        </div>
      </div>
    </div>
  );
});