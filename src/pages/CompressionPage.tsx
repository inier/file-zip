import React from 'react';
import { observer } from 'mobx-react-lite';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { CompressionPanel } from '../components/CompressionPanel';
import { CompressedFileList } from '../components/CompressedFileList';
import { useFileClassification } from '../hooks/useFileClassification';
import styles from './Page.module.scss';

export const CompressionPage: React.FC = observer(() => {
  const { getFilesForTab } = useFileClassification();
  const currentFiles = getFilesForTab('compress');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>文件压缩</h2>
        <p className={styles.pageDescription}>
          支持ZIP、GZIP、Deflate等多种格式的文件压缩
        </p>
      </div>
      
      <div className={styles.pageContent}>
        <FileUpload 
          activeTab="compress"
          accept="*/*"
          multiple={true}
        />
        
        {currentFiles.length > 0 && (
          <FileList activeTab="compress" />
        )}
        
        <CompressionPanel />
        <CompressedFileList />
      </div>
    </div>
  );
});