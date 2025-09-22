import React from 'react';
import { observer } from 'mobx-react-lite';
import { DecompressionPanel } from '../components/DecompressionPanel';
import styles from './Page.module.scss';

export const DecompressionPage: React.FC = observer(() => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>文件解压</h2>
        <p className={styles.pageDescription}>
          支持ZIP、RAR、7Z、TAR等多种压缩格式的文件解压
        </p>
      </div>
      
      <div className={styles.pageContent}>
        <DecompressionPanel />
      </div>
    </div>
  );
});