import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore, ArchiveEntry } from '../store/FileStore';
import { compressionService } from '../services/CompressionService';
import styles from './DecompressionPanel.module.scss';

export const DecompressionPanel: React.FC = observer(() => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedEntries([]);
      // 自动分析压缩文件
      handleAnalyze(file);
    }
  };

  const handleAnalyze = async (file: File) => {
    try {
      await compressionService.decompressFile(file);
    } catch (error) {
      console.error('分析压缩文件失败:', error);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    try {
      const filesToExtract = selectedEntries.length > 0 ? selectedEntries : undefined;
      const extractedFiles = await compressionService.extractFiles(selectedFile, filesToExtract);
      
      // 下载提取的文件
      extractedFiles.forEach(file => {
        compressionService.downloadFile(file, file.name);
      });

    } catch (error) {
      console.error('提取文件失败:', error);
    }
  };

  const handleSelectEntry = (entryName: string) => {
    setSelectedEntries(prev => {
      if (prev.includes(entryName)) {
        return prev.filter(name => name !== entryName);
      } else {
        return [...prev, entryName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === fileStore.currentArchiveEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(fileStore.currentArchiveEntries.map(entry => entry.name));
    }
  };

  const formatFileSize = (bytes: number): string => {
    return compressionService.formatFileSize(bytes);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('zh-CN');
  };

  const getFileIcon = (name: string, isDirectory: boolean): string => {
    if (isDirectory) return '📁';
    
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return '🎵';
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'txt':
        return '📃';
      default:
        return '📄';
    }
  };

  return (
    <div className={styles.decompressionPanel}>
      <h3 className={styles.panelTitle}>解压缩文件</h3>
      
      <div className={styles.panelContent}>
        <div className={styles.fileSelectArea}>
          <label className={styles.fileSelectLabel}>
            <input
              type="file"
              accept=".zip,.gz,.gzip,.7z,.rar,.tar"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className={styles.fileSelectButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              选择压缩文件
            </div>
          </label>
          
          {selectedFile && (
            <div className={styles.selectedFileInfo}>
              <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
            </div>
          )}
        </div>

        {fileStore.currentArchiveEntries.length > 0 && (
          <div className={styles.archiveContent}>
            <div className={styles.archiveHeader}>
              <h4 className={styles.archiveTitle}>
                压缩包内容 ({fileStore.currentArchiveEntries.length} 项)
              </h4>
              <div className={styles.archiveActions}>
                <button
                  className={styles.selectAllButton}
                  onClick={handleSelectAll}
                >
                  {selectedEntries.length === fileStore.currentArchiveEntries.length 
                    ? '取消全选' 
                    : '全选'
                  }
                </button>
                <button
                  className={styles.extractButton}
                  onClick={handleExtract}
                  disabled={fileStore.isProcessing}
                >
                  {fileStore.isProcessing ? (
                    <>
                      <div className={styles.loadingSpinner}></div>
                      提取中...
                    </>
                  ) : (
                    <>
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
                      提取选中文件
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.entriesList}>
              {fileStore.currentArchiveEntries.map((entry, index) => (
                <div 
                  key={`${entry.name}-${index}`} 
                  className={`${styles.entryItem} ${selectedEntries.includes(entry.name) ? styles.selected : ''}`}
                  onClick={() => handleSelectEntry(entry.name)}
                >
                  <div className={styles.entryIcon}>
                    {getFileIcon(entry.name, entry.isDirectory)}
                  </div>
                  
                  <div className={styles.entryInfo}>
                    <div className={styles.entryName} title={entry.name}>
                      {entry.name}
                    </div>
                    <div className={styles.entryDetails}>
                      <span className={styles.entrySize}>
                        {formatFileSize(entry.size)}
                      </span>
                      {entry.compressedSize !== entry.size && (
                        <span className={styles.entryCompressedSize}>
                          (压缩: {formatFileSize(entry.compressedSize)})
                        </span>
                      )}
                      <span className={styles.entryDate}>
                        {formatDate(entry.lastModified)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.entryCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.name)}
                      onChange={() => handleSelectEntry(entry.name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});