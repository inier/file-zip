import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore, CompressedFile } from '../store/FileStore';
import { compressionService } from '../services/CompressionService';
import { TrashIcon, DownloadIcon, RemoveIcon } from './icons';
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
            <TrashIcon width={16} height={16} />
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
                <DownloadIcon width={16} height={16} />
                下载
              </button>
              
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(file.id)}
                title="移除文件"
              >
                <RemoveIcon width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});