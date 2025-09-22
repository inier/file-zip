import React from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore, FileItem } from '../store/FileStore';
import { compressionService } from '../services/CompressionService';
import { useFileClassification } from '../hooks/useFileClassification';
import { TrashIcon, RemoveIcon } from './icons';
import styles from './FileList.module.scss';

interface FileListProps {
  activeTab: 'compress' | 'image-compress' | 'decompress';
}

export const FileList: React.FC<FileListProps> = observer(({ activeTab }) => {
  const { getFilesForTab, getTotalSizeForTab, removeFileForTab, clearFilesForTab } = useFileClassification();
  
  const currentFiles = getFilesForTab(activeTab);
  const currentTotalSize = getTotalSizeForTab(activeTab);
  
  if (currentFiles.length === 0) {
    return null;
  }

  const handleRemoveFile = (id: string) => {
    removeFileForTab(id, activeTab);
  };

  const handleClearAll = () => {
    clearFilesForTab(activeTab);
  };

  const formatFileSize = (bytes: number): string => {
    return compressionService.formatFileSize(bytes);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return '📦';
    if (type.includes('text')) return '📃';
    return '📄';
  };

  return (
    <div className={styles.fileList}>
      <div className={styles.fileListHeader}>
        <h3 className={styles.fileListTitle}>
          {activeTab === 'compress' ? '文件列表' : '图片列表'} ({currentFiles.length})
        </h3>
        
        <div className={styles.fileListActions}>
          <span className={styles.fileSummary}>
            总大小: {formatFileSize(currentTotalSize)}
          </span>
          <button 
            className={styles.clearButton}
            onClick={handleClearAll}
            title="清空所有文件"
          >
            <TrashIcon width={16} height={16} />
            清空
          </button>
        </div>
      </div>

      <div className={styles.fileListContent}>
        {currentFiles.map((file) => (
          <div key={file.id} className={styles.fileItem}>
            <div className={styles.fileIcon}>
              {getFileIcon(file.type)}
            </div>
            
            <div className={styles.fileInfo}>
              <div className={styles.fileName} title={file.name}>
                {file.name}
              </div>
              <div className={styles.fileDetails}>
                <span className={styles.fileSize}>
                  {formatFileSize(file.size)}
                </span>
                <span className={styles.fileType}>
                  {file.type || 'unknown'}
                </span>
                <span className={styles.fileDate}>
                  {formatDate(file.lastModified)}
                </span>
              </div>
            </div>

            <button
              className={styles.removeButton}
              onClick={() => handleRemoveFile(file.id)}
              title="移除文件"
            >
              <RemoveIcon width={16} height={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
