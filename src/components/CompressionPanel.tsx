import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import { compressionService, CompressionFormat, CompressionOptions } from '../services/CompressionService';
import { FilePackageIcon, ErrorIcon } from './icons';
import styles from './CompressionPanel.module.scss';

export const CompressionPanel: React.FC = observer(() => {
  const [format, setFormat] = useState<CompressionFormat>('zip');
  const [level, setLevel] = useState<number>(6);
  const [fileName, setFileName] = useState<string>('');

  const handleCompress = async () => {
    // 清除之前的错误
    fileStore.setError(null);
    
    if (fileStore.compressionFiles.length === 0) {
      fileStore.setError('请先选择要压缩的文件');
      return;
    }

    if (format === 'gzip' && fileStore.compressionFiles.length > 1) {
      fileStore.setError('GZIP格式只支持压缩单个文件，请选择一个文件或切换到其他格式');
      return;
    }

    // 文件大小验证
    const totalSize = fileStore.compressionTotalSize;
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (totalSize > maxSize) {
      fileStore.setError(`文件总大小超过限制（${compressionService.formatFileSize(maxSize)}）`);
      return;
    }

    try {
      const options: CompressionOptions = {
        format,
        level: Math.max(0, Math.min(9, level)), // 确保级别在有效范围内
        fileName: fileName.trim() || undefined
      };

      console.log('开始压缩:', {
        files: fileStore.compressionFiles.length,
        format,
        level,
        fileName,
        totalSize: compressionService.formatFileSize(totalSize)
      });

      const compressedFile = await compressionService.compressFiles(fileStore.compressionFiles, options);
      
      console.log('压缩成功:', {
        originalSize: compressionService.formatFileSize(compressedFile.originalSize),
        compressedSize: compressionService.formatFileSize(compressedFile.size),
        ratio: compressionService.formatCompressionRatio(compressedFile.compressionRatio)
      });
      
      fileStore.addCompressedFile(compressedFile);
      
      // 清空原文件列表
      fileStore.clearCompressionFiles();
      
      // 重置表单
      setFileName('');
      
    } catch (error) {
      console.error('压缩失败:', error);
      const errorMessage = error instanceof Error ? error.message : '压缩过程中出现未知错误';
      fileStore.setError(errorMessage);
    }
  };

  const isCompressing = fileStore.isProcessing;
  const hasFiles = fileStore.compressionFiles.length > 0;

  return (
    <div className={styles.compressionPanel}>
      <h3 className={styles.panelTitle}>压缩设置</h3>
      
      <div className={styles.panelContent}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>压缩格式</label>
          <select 
            className={styles.formSelect}
            value={format}
            onChange={(e) => setFormat(e.target.value as CompressionFormat)}
            disabled={isCompressing}
          >
            <option value="zip">ZIP - 最常用的压缩格式</option>
            <option value="gzip">GZIP - 单文件高效压缩</option>
            <option value="deflate">Deflate - 轻量级压缩</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            压缩级别 ({level})
            <span className={styles.levelDesc}>
              {level === 0 && ' - 无压缩'}
              {level >= 1 && level <= 3 && ' - 快速压缩'}
              {level >= 4 && level <= 6 && ' - 平衡'}
              {level >= 7 && level <= 9 && ' - 最大压缩'}
            </span>
          </label>
          <div className={styles.levelContainer}>
            <input
              type="range"
              className={styles.formRange}
              min="0"
              max="9"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              disabled={isCompressing}
            />
            <div className={styles.levelLabels}>
              <span>快速 (0)</span>
              <span>平衡 (6)</span>
              <span>最大 (9)</span>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>文件名 (可选)</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder={`例如: my-archive.${format}`}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={isCompressing}
          />
        </div>

        {format === 'gzip' && fileStore.compressionFiles.length > 1 && (
          <div className={styles.warningMessage}>
            ⚠️ GZIP格式只支持压缩单个文件，请选择一个文件或切换到其他格式。
          </div>
        )}

        <button
          className={`${styles.compressButton} ${!hasFiles || isCompressing ? styles.disabled : ''}`}
          onClick={handleCompress}
          disabled={!hasFiles || isCompressing}
        >
          {isCompressing ? (
            <>
              <div className={styles.loadingSpinner}></div>
              压缩中...
            </>
          ) : (
            <>
              <FilePackageIcon width={16} height={16} />
              开始压缩 ({fileStore.compressionFiles.length} 个文件)
            </>
          )}
        </button>

        {hasFiles && (
          <div className={styles.fileSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>文件数量:</span>
              <span className={styles.summaryValue}>{fileStore.compressionFiles.length}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>总大小:</span>
              <span className={styles.summaryValue}>
                {compressionService.formatFileSize(fileStore.compressionTotalSize)}
              </span>
            </div>
          </div>
        )}

        {/* 进度显示 */}
        {isCompressing && fileStore.progress > 0 && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${fileStore.progress}%` }}
              ></div>
            </div>
            <div className={styles.progressText}>
              {fileStore.currentOperation} ({Math.round(fileStore.progress)}%)
            </div>
          </div>
        )}

        {/* 错误信息 */}
        {fileStore.error && (
          <div className={styles.errorMessage}>
            <ErrorIcon width={16} height={16} />
            {fileStore.error}
          </div>
        )}
      </div>
    </div>
  );
});