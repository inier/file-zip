import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import { imageCompressionService, CompressedImageResult } from '../services/ImageCompressionService';
import styles from './CompressedImageList.module.scss';

export const CompressedImageList: React.FC = observer(() => {
  if (fileStore.compressedImages.length === 0) {
    return null;
  }

  const handleDownload = (result: CompressedImageResult) => {
    imageCompressionService.downloadCompressedImage(result);
  };

  const handleDownloadAll = () => {
    imageCompressionService.downloadAllCompressedImages(fileStore.compressedImages);
  };

  const handleRemove = (id: string) => {
    fileStore.removeCompressedImage(id);
  };

  const handleClearAll = () => {
    fileStore.clearCompressedImages();
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getFormatIcon = (format: string): string => {
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return '📸';
      case 'png':
        return '🖼️';
      case 'webp':
        return '🎨';
      case 'gif':
        return '🎞️';
      default:
        return '🖼️';
    }
  };

  const getCompressionColor = (ratio: number): string => {
    if (ratio >= 50) return '#4CAF50'; // 绿色 - 压缩效果很好
    if (ratio >= 25) return '#2196F3'; // 蓝色 - 压缩效果不错
    if (ratio >= 10) return '#FF9800'; // 橙色 - 压缩效果一般
    if (ratio >= 0) return '#FFC107';  // 黄色 - 压缩效果轻微
    return '#F44336'; // 红色 - 文件增大了
  };

  return (
    <div className={styles.compressedImageList}>
      <div className={styles.listHeader}>
        <div className={styles.headerTitle}>
          <h3 className={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
              <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
            </svg>
            压缩完成 ({fileStore.compressedImages.length} 张)
          </h3>
          <div className={styles.compressionStats}>
            <span className={styles.statItem}>
              原始大小: {imageCompressionService.formatFileSize(fileStore.totalOriginalImageSize)}
            </span>
            <span className={styles.statItem}>
              压缩后: {imageCompressionService.formatFileSize(fileStore.totalCompressedImageSize)}
            </span>
            <span 
              className={`${styles.statItem} ${styles.compressionRatio}`}
              style={{ color: getCompressionColor(fileStore.overallImageCompressionRatio) }}
            >
              总体压缩: {imageCompressionService.formatCompressionRatio(fileStore.overallImageCompressionRatio)}
            </span>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={`${styles.actionButton} ${styles.downloadAll}`}
            onClick={handleDownloadAll}
            title="下载所有图片"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="7,10 12,15 17,10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            全部下载
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.clearAll}`}
            onClick={handleClearAll}
            title="清空列表"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            清空
          </button>
        </div>
      </div>

      <div className={styles.listContent}>
        {fileStore.compressedImages.map((result) => (
          <div key={result.id} className={styles.imageItem}>
            <div className={styles.imagePreview}>
              <img 
                src={URL.createObjectURL(result.compressedFile)}
                alt={result.compressedFile.name}
                className={styles.previewImg}
                loading="lazy"
              />
              <div className={styles.formatBadge}>
                <span className={styles.formatIcon}>{getFormatIcon(result.format)}</span>
                <span className={styles.formatText}>{result.format.toUpperCase()}</span>
              </div>
            </div>
            
            <div className={styles.imageInfo}>
              <div className={styles.imageName} title={result.compressedFile.name}>
                {result.compressedFile.name}
              </div>
              
              <div className={styles.imageDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>尺寸:</span>
                  <span className={styles.detailValue}>
                    {result.width && result.height ? `${result.width} × ${result.height}` : '未知'}
                  </span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>压缩前:</span>
                  <span className={`${styles.detailValue} ${styles.originalSize}`}>
                    {imageCompressionService.formatFileSize(result.originalSize)}
                  </span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>压缩后:</span>
                  <span className={`${styles.detailValue} ${styles.compressedSize}`}>
                    {imageCompressionService.formatFileSize(result.compressedSize)}
                  </span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>压缩率:</span>
                  <span 
                    className={`${styles.detailValue} ${styles.compressionRatio}`}
                    style={{ color: getCompressionColor(result.compressionRatio) }}
                  >
                    {imageCompressionService.formatCompressionRatio(result.compressionRatio)}
                  </span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>时间:</span>
                  <span className={styles.detailValue}>{formatDate(result.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className={styles.imageActions}>
              <button
                className={`${styles.actionButton} ${styles.download}`}
                onClick={() => handleDownload(result)}
                title="下载图片"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="7,10 12,15 17,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                下载
              </button>
              
              <button
                className={`${styles.actionButton} ${styles.remove}`}
                onClick={() => handleRemove(result.id)}
                title="移除"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});