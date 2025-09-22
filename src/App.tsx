import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { CompressionPanel } from './components/CompressionPanel';
import { ImageCompressionPanel } from './components/ImageCompressionPanel';
import { CompressedFileList } from './components/CompressedFileList';
import { CompressedImageList } from './components/CompressedImageList';
import { DecompressionPanel } from './components/DecompressionPanel';
import { fileStore } from './store/FileStore';
import { useFileClassification } from './hooks/useFileClassification';
import styles from './App.module.scss';

const App: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState<'compress' | 'image-compress' | 'decompress'>('compress');
  const { getFilesForTab } = useFileClassification();

  // 获取当前标签页的文件列表
  const currentFiles = getFilesForTab(activeTab);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header 
          title="文件压缩解压工具" 
          subtitle="支持ZIP、GZIP、Deflate等多种格式的文件压缩和解压缩"
        />
        
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'compress' ? styles.active : ''}`}
              onClick={() => setActiveTab('compress')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              文件打包
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'image-compress' ? styles.active : ''}`}
              onClick={() => setActiveTab('image-compress')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              图片优化
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'decompress' ? styles.active : ''}`}
              onClick={() => setActiveTab('decompress')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                <path
                  d="M12 18v-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 15l3-3 3 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              文件解压
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'compress' && (
              <div className={styles.compressionTab}>
                <FileUpload 
                  activeTab={activeTab}
                  accept="*/*"
                  multiple={true}
                />
                {currentFiles.length > 0 && <FileList activeTab={activeTab} />}
                <CompressionPanel />
                <CompressedFileList />
              </div>
            )}

            {activeTab === 'image-compress' && (
              <div className={styles.imageCompressionTab}>
                <FileUpload 
                  activeTab={activeTab}
                  accept="image/*"
                  multiple={true}
                />
                {currentFiles.length > 0 && <FileList activeTab={activeTab} />}
                <ImageCompressionPanel />
                <CompressedImageList />
              </div>
            )}

            {activeTab === 'decompress' && (
              <div className={styles.decompressionTab}>
                <DecompressionPanel />
              </div>
            )}
          </div>
        </div>

        {/* 全局错误和进度显示 */}
        {fileStore.error && (
          <div className={styles.globalError}>
            <div className={styles.errorContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="9"
                  x2="9"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="9"
                  x2="15"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {fileStore.error}
              <button 
                className={styles.errorClose}
                onClick={() => fileStore.setError(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {fileStore.isProcessing && (
          <div className={styles.globalProgress}>
            <div className={styles.progressContent}>
              <div className={styles.progressText}>
                {fileStore.currentOperation}
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${fileStore.progress}%` }}
                ></div>
              </div>
              <div className={styles.progressPercent}>
                {Math.round(fileStore.progress)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default App;