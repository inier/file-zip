import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { fileStore } from '../store/FileStore';
import { imageCompressionService, ImageCompressionOptions } from '../services/ImageCompressionService';
import { ImageOptimizeIcon } from './icons';
import styles from './ImageCompressionPanel.module.scss';

export const ImageCompressionPanel: React.FC = observer(() => {
  const [options, setOptions] = useState<ImageCompressionOptions>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    format: 'jpeg',
    useWebWorker: true
  });

  // 使用专门的图片文件数据源
  const imageFiles = fileStore.imageFiles;

  const handleCompress = async () => {
    if (imageFiles.length === 0) {
      fileStore.setError('请先选择图片文件');
      return;
    }

    try {
      if (imageFiles.length === 1) {
        // 单个图片压缩
        const result = await imageCompressionService.compressImage(imageFiles[0].file, options);
        fileStore.addCompressedImage(result);
      } else {
        // 批量图片压缩
        const results = await imageCompressionService.compressImages(
          imageFiles.map(item => item.file), 
          options
        );
        fileStore.addCompressedImages(results);
      }
      
      // 清空原文件列表
      fileStore.clearImageFiles();
      
    } catch (error) {
      console.error('图片压缩失败:', error);
    }
  };

  const handleOptionChange = (key: keyof ImageCompressionOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getQualityDescription = (quality: number): string => {
    if (quality >= 0.9) return '最高质量';
    if (quality >= 0.8) return '高质量';
    if (quality >= 0.7) return '标准质量';
    if (quality >= 0.6) return '中等质量';
    return '较低质量';
  };

  const getSizeDescription = (sizeMB: number): string => {
    if (sizeMB >= 5) return '保留较大文件';
    if (sizeMB >= 2) return '标准压缩';
    if (sizeMB >= 1) return '较强压缩';
    return '最大压缩';
  };

  const applyPreset = (preset: 'high-quality' | 'balanced' | 'small-size') => {
    switch (preset) {
      case 'high-quality':
        setOptions({
          maxSizeMB: 5,
          maxWidthOrHeight: 2560,
          quality: 0.92,
          format: 'jpeg',
          useWebWorker: true
        });
        break;
      case 'balanced':
        setOptions({
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          quality: 0.8,
          format: 'jpeg',
          useWebWorker: true
        });
        break;
      case 'small-size':
        setOptions({
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          quality: 0.7,
          format: 'jpeg',
          useWebWorker: true
        });
        break;
    }
  };

  const isCompressing = fileStore.isProcessing;
  const hasImageFiles = imageFiles.length > 0;

  return (
    <div className={styles.imageCompressionPanel}>
      <h3 className={styles.panelTitle}>
        <ImageOptimizeIcon width={20} height={20} />
        图片压缩设置
      </h3>
      
      <div className={styles.panelContent}>
        {/* 快速预设 */}
        <div className={styles.presetSection}>
          <label className={styles.sectionLabel}>快速预设</label>
          <div className={styles.presetButtons}>
            <button 
              className={`${styles.presetButton} ${styles.highQuality}`}
              onClick={() => applyPreset('high-quality')}
              disabled={isCompressing}
            >
              <div className={styles.presetIcon}>🌟</div>
              <div className={styles.presetInfo}>
                <div className={styles.presetName}>高质量</div>
                <div className={styles.presetDesc}>保持最佳画质</div>
              </div>
            </button>
            <button 
              className={`${styles.presetButton} ${styles.balanced}`}
              onClick={() => applyPreset('balanced')}
              disabled={isCompressing}
            >
              <div className={styles.presetIcon}>⚖️</div>
              <div className={styles.presetInfo}>
                <div className={styles.presetName}>平衡</div>
                <div className={styles.presetDesc}>质量与大小平衡</div>
              </div>
            </button>
            <button 
              className={`${styles.presetButton} ${styles.smallSize}`}
              onClick={() => applyPreset('small-size')}
              disabled={isCompressing}
            >
              <div className={styles.presetIcon}>📦</div>
              <div className={styles.presetInfo}>
                <div className={styles.presetName}>小文件</div>
                <div className={styles.presetDesc}>最小文件大小</div>
              </div>
            </button>
          </div>
        </div>

        {/* 输出格式 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>输出格式</label>
          <select 
            className={styles.formSelect}
            value={options.format}
            onChange={(e) => handleOptionChange('format', e.target.value)}
            disabled={isCompressing}
          >
            <option value="jpeg">JPEG - 最佳压缩比，适合照片</option>
            <option value="png">PNG - 支持透明，适合图标</option>
            <option value="webp">WebP - 新格式，更好压缩</option>
          </select>
        </div>

        {/* 图片质量 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            图片质量 ({Math.round(options.quality! * 100)}%)
            <span className={styles.qualityDesc}>- {getQualityDescription(options.quality!)}</span>
          </label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              className={styles.formRange}
              min="0.1"
              max="1"
              step="0.05"
              value={options.quality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              disabled={isCompressing}
            />
            <div className={styles.rangeLabels}>
              <span>较低质量</span>
              <span>标准</span>
              <span>最高质量</span>
            </div>
          </div>
        </div>

        {/* 文件大小限制 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            最大文件大小 ({options.maxSizeMB}MB)
            <span className={styles.sizeDesc}>- {getSizeDescription(options.maxSizeMB!)}</span>
          </label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              className={styles.formRange}
              min="0.1"
              max="10"
              step="0.1"
              value={options.maxSizeMB}
              onChange={(e) => handleOptionChange('maxSizeMB', parseFloat(e.target.value))}
              disabled={isCompressing}
            />
            <div className={styles.rangeLabels}>
              <span>0.1MB</span>
              <span>5MB</span>
              <span>10MB</span>
            </div>
          </div>
        </div>

        {/* 图片尺寸 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>最大宽度/高度 (像素)</label>
          <select 
            className={styles.formSelect}
            value={options.maxWidthOrHeight}
            onChange={(e) => handleOptionChange('maxWidthOrHeight', parseInt(e.target.value))}
            disabled={isCompressing}
          >
            <option value={4096}>4K (4096px) - 超高清</option>
            <option value={2560}>2.5K (2560px) - 高清</option>
            <option value={1920}>1080p (1920px) - 标准</option>
            <option value={1280}>720p (1280px) - 紧凑</option>
            <option value={854}>480p (854px) - 小尺寸</option>
          </select>
        </div>

        {/* 压缩按钮 */}
        <button
          className={`${styles.compressButton} ${!hasImageFiles || isCompressing ? styles.disabled : ''}`}
          onClick={handleCompress}
          disabled={!hasImageFiles || isCompressing}
        >
          {isCompressing ? (
            <>
              <div className={styles.loadingSpinner}></div>
              压缩中...
            </>
          ) : (
            <>
              <ImageOptimizeIcon width={16} height={16} />
              压缩图片 ({imageFiles.length} 张)
            </>
          )}
        </button>

        {/* 文件信息 */}
        {hasImageFiles && (
          <div className={styles.fileSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>图片数量:</span>
              <span className={styles.summaryValue}>{imageFiles.length} 张</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>总大小:</span>
              <span className={styles.summaryValue}>
                {imageCompressionService.formatFileSize(
                  imageFiles.reduce((sum, file) => sum + file.size, 0)
                )}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>估计压缩后:</span>
              <span className={`${styles.summaryValue} ${styles.estimated}`}>
                ~{imageCompressionService.formatFileSize(
                  imageFiles.reduce((sum, file) => sum + file.size, 0) * options.quality!
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});