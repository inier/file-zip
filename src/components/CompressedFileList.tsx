import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore, CompressedFile } from '../store/FileStore';
import { compressionService } from '../services/CompressionService';
import styles from './CompressedFileList.module.scss';

export const CompressedFileList: React.FC = observer(() => {
  if (fileStore.compressedFiles.length === 0) {
    return null;
  }

  const handleDownload = (compressedFile: CompressedFile) => {
    compressionService.downloadFile(compressedFile.blob, compressedFile.name);
  };

  const handleRemove = (id: string) => {
    fileStore.removeCompressedFile(id);
  };

  const handleClearAll = () => {
    fileStore.clearCompressedFiles();
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getFormatIcon = (format: string): string => {
    switch (format) {
      case 'zip': return '📦';
      case 'gzip': return '🗜️';
      case 'deflate': return '📄';
      default: return '📦';
    }
  };

  return (
    <div className={styles.compressedFileList}>
      <div className={styles.compressedListHeader}>
        <h3 className={styles.compressedListTitle}>
          压缩文件 ({fileStore.compressedFiles.length})
        </h3>
        <div className={styles.compressedListActions}>
          <span className={styles.compressionSummary}>
            压缩率: {compressionService.formatCompressionRatio(fileStore.overallCompressionRatio)}
          </span>
          <button 
            className={styles.clearButton}
            onClick={handleClearAll}
            title="清空所有压缩文件"
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

      <div className={styles.compressedListContent}>
        {fileStore.compressedFiles.map((file) => (
          <div key={file.id} className={styles.compressedItem}>
            <div className={styles.compressedIcon}>
              {getFormatIcon(file.format)}
            </div>
            
            <div className={styles.compressedInfo}>
              <div className={styles.compressedName} title={file.name}>
                {file.name}
              </div>
              <div className={styles.compressedDetails}>
                <span className={styles.compressedFormat}>{file.format.toUpperCase()}</span>
                <span className={styles.compressedSize}>
                  {compressionService.formatFileSize(file.size)}
                </span>
                <span className={styles.compressionRatio}>
                  压缩率: {compressionService.formatCompressionRatio(file.compressionRatio)}
                </span>
                <span className={styles.compressedDate}>{formatDate(file.createdAt)}</span>
              </div>
            </div>

            <div className={styles.compressedActions}>
              <button
                className={styles.downloadButton}
                onClick={() => handleDownload(file)}
                title="下载文件"
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
                className={styles.removeButton}
                onClick={() => handleRemove(file.id)}
                title="移除文件"
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