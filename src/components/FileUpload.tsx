import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import { useFileClassification } from '../hooks/useFileClassification';
import { UploadIcon } from './icons';
import { formatFileSize } from '../utils/constants';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  activeTab: 'compress' | 'image-compress' | 'decompress';
  onFilesAdded?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

export const FileUpload: React.FC<FileUploadProps> = observer(({
  activeTab,
  onFilesAdded,
  accept = "*/*",
  multiple = true,
  maxSize = 100 * 1024 * 1024 // 100MB default
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const { addFilesForTab, getFilesForTab, getTotalSizeForTab } = useFileClassification();

  // 获取当前标签页的文件和大小
  const currentFiles = getFilesForTab(activeTab);
  const currentTotalSize = getTotalSizeForTab(activeTab);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        errors.push(`文件 ${file.name} 超过大小限制 (${formatFileSize(maxSize)})`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      fileStore.setError(errors.join('\n'));
    }

    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        addFilesForTab(validFiles, activeTab);
        onFilesAdded?.(files);
      }
    }
  }, [maxSize, onFilesAdded, activeTab, addFilesForTab]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        addFilesForTab(validFiles, activeTab);
        onFilesAdded?.(files);
      }
    }
    // Clear the input value to allow selecting the same file again
    e.target.value = '';
  }, [maxSize, onFilesAdded, activeTab, addFilesForTab]);

  return (
    <div className={`${styles.fileUpload} ${isDragOver ? styles.dragOver : ''}`}>
      <div
        className={styles.uploadArea}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.uploadContent}>
          <div className={styles.uploadIcon}>
            <UploadIcon />
          </div>

          <div className={styles.uploadText}>
            <h3 className={styles.uploadTitle}>
              {isDragOver ? '释放文件以上传' : '拖拽文件到这里'}
            </h3>
            <p className={styles.uploadSubtitle}>
              或者 <span className={styles.uploadLink}>点击选择文件</span>
            </p>
            <p className={styles.uploadInfo}>
              {activeTab === 'compress' 
                ? '支持所有类型文件（包括图片）压缩为ZIP等格式' 
                : activeTab === 'image-compress'
                ? '仅支持图片文件进行优化压缩'
                : '支持多种压缩格式'
              } • 最大 {formatFileSize(maxSize)}
            </p>
          </div>

          <input
            type="file"
            className={styles.fileInput}
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {currentFiles.length > 0 && (
        <div className={styles.uploadSummary}>
          <span className={styles.fileCount}>
            已选择 {currentFiles.length} 个文件
          </span>
          <span className={styles.totalSize}>
            总大小: {formatFileSize(currentTotalSize)}
          </span>
        </div>
      )}
    </div>
  );
});