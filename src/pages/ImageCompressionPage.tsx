import React from 'react';
import { observer } from 'mobx-react-lite';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { ImageCompressionPanel } from '../components/ImageCompressionPanel';
import { CompressedImageList } from '../components/CompressedImageList';
import { useFileClassification } from '../hooks/useFileClassification';
import styles from './Page.module.scss';

export const ImageCompressionPage: React.FC = observer(() => {
  const { getFilesForTab } = useFileClassification();
  const currentFiles = getFilesForTab('image-compress');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>图片压缩</h2>
        <p className={styles.pageDescription}>
          智能图片压缩优化，支持JPEG、PNG、WebP等格式
        </p>
      </div>
      
      <div className={styles.pageContent}>
        <FileUpload 
          activeTab="image-compress"
          accept="image/*"
          multiple={true}
        />
        
        {currentFiles.length > 0 && (
          <FileList activeTab="image-compress" />
        )}
        
        <ImageCompressionPanel />
        <CompressedImageList />
      </div>
    </div>
  );
});