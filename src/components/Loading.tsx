import React from 'react';
import styles from './Loading.module.scss';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = '加载中...', 
  size = 'medium' 
}) => {
  return (
    <div className={`${styles.loading} ${styles[size]}`}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        
        <p className={styles.loadingMessage}>{message}</p>
      </div>
    </div>
  );
};