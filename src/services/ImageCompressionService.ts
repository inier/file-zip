import imageCompression from 'browser-image-compression';
import { fileStore } from '../store/FileStore';

export interface ImageCompressionOptions {
  maxSizeMB?: number;          // 最大文件大小(MB)
  maxWidthOrHeight?: number;   // 最大宽度或高度
  useWebWorker?: boolean;      // 是否使用Web Worker
  quality?: number;            // 图片质量 (0-1)
  format?: 'jpeg' | 'png' | 'webp';  // 输出格式
  initialQuality?: number;     // 初始质量
}

export interface CompressedImageResult {
  id: string;
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
  width?: number;
  height?: number;
  createdAt: number;
}

export class ImageCompressionService {
  
  // 检查文件是否为图片
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // 获取支持的图片格式
  getSupportedFormats(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  }

  // 压缩单个图片
  async compressImage(file: File, options: ImageCompressionOptions = {}): Promise<CompressedImageResult> {
    if (!this.isImageFile(file)) {
      throw new Error(`文件 "${file.name}" 不是支持的图片格式`);
    }

    fileStore.setCurrentOperation(`正在压缩图片: ${file.name}`);
    fileStore.setProgress(0);

    try {
      // 默认压缩选项
      const defaultOptions: ImageCompressionOptions = {
        maxSizeMB: 1,           // 默认最大1MB
        maxWidthOrHeight: 1920, // 默认最大1920px
        useWebWorker: true,     // 使用Web Worker避免阻塞UI
        quality: 0.8,           // 默认80%质量
        format: 'jpeg',         // 默认输出JPEG
        initialQuality: 0.8
      };

      const compressionOptions = { ...defaultOptions, ...options };

      // 获取原始图片信息
      const originalDimensions = await this.getImageDimensions(file);
      
      fileStore.setProgress(20);

      // 执行压缩
      const compressedFile = await imageCompression(file, {
        maxSizeMB: compressionOptions.maxSizeMB!,
        maxWidthOrHeight: compressionOptions.maxWidthOrHeight!,
        useWebWorker: compressionOptions.useWebWorker!,
        initialQuality: compressionOptions.quality!,
        onProgress: (progress: number) => {
          fileStore.setProgress(20 + (progress * 0.7)); // 20% + 70% for compression
        }
      });

      fileStore.setProgress(95);

      // 如果指定了输出格式且与原格式不同，进行格式转换
      let finalFile = compressedFile;
      if (compressionOptions.format && compressionOptions.format !== this.getFileFormat(file)) {
        finalFile = await this.convertFormat(compressedFile, compressionOptions.format, compressionOptions.quality);
      }

      fileStore.setProgress(100);

      const result: CompressedImageResult = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalFile: file,
        compressedFile: finalFile,
        originalSize: file.size,
        compressedSize: finalFile.size,
        compressionRatio: ((file.size - finalFile.size) / file.size) * 100,
        format: compressionOptions.format || this.getFileFormat(file),
        width: originalDimensions.width,
        height: originalDimensions.height,
        createdAt: Date.now()
      };

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '图片压缩失败';
      fileStore.setError(`压缩图片 "${file.name}" 时出错: ${errorMessage}`);
      throw error;
    }
  }

  // 批量压缩图片
  async compressImages(files: File[], options: ImageCompressionOptions = {}): Promise<CompressedImageResult[]> {
    const results: CompressedImageResult[] = [];
    const imageFiles = files.filter(file => this.isImageFile(file));

    if (imageFiles.length === 0) {
      throw new Error('没有找到支持的图片文件');
    }

    fileStore.setProcessing(true);
    fileStore.setCurrentOperation('正在批量压缩图片...');
    
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        fileStore.setCurrentOperation(`正在压缩图片 ${i + 1}/${imageFiles.length}: ${file.name}`);
        
        // 计算整体进度
        const baseProgress = (i / imageFiles.length) * 100;
        fileStore.setProgress(baseProgress);

        const result = await this.compressImage(file, options);
        results.push(result);

        // 更新完成进度
        fileStore.setProgress(((i + 1) / imageFiles.length) * 100);
      }

      fileStore.setCurrentOperation('批量压缩完成');
      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '批量压缩失败';
      fileStore.setError(`批量压缩图片时出错: ${errorMessage}`);
      throw error;
    } finally {
      setTimeout(() => {
        fileStore.setProcessing(false);
        fileStore.resetProgress();
      }, 1000);
    }
  }

  // 获取图片尺寸
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('无法读取图片尺寸'));
      };

      img.src = url;
    });
  }

  // 获取文件格式
  private getFileFormat(file: File): string {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'jpeg';
    if (type.includes('png')) return 'png';
    if (type.includes('webp')) return 'webp';
    if (type.includes('gif')) return 'gif';
    return 'jpeg'; // 默认
  }

  // 格式转换
  private convertFormat(file: File, targetFormat: string, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${targetFormat}`;
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              const fileName = this.changeFileExtension(file.name, targetFormat);
              const convertedFile = new File([blob], fileName, { type: mimeType });
              resolve(convertedFile);
            } else {
              reject(new Error('格式转换失败'));
            }
          }, mimeType, quality);
        } else {
          reject(new Error('Canvas上下文创建失败'));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图片加载失败'));
      };

      img.src = url;
    });
  }

  // 修改文件扩展名
  private changeFileExtension(fileName: string, newFormat: string): string {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const extension = newFormat === 'jpeg' ? 'jpg' : newFormat;
    return `${nameWithoutExt}_compressed.${extension}`;
  }

  // 下载压缩后的图片
  downloadCompressedImage(result: CompressedImageResult) {
    const url = URL.createObjectURL(result.compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 批量下载压缩图片
  downloadAllCompressedImages(results: CompressedImageResult[]) {
    results.forEach((result, index) => {
      setTimeout(() => {
        this.downloadCompressedImage(result);
      }, index * 200); // 间隔200ms下载，避免浏览器阻止
    });
  }

  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 格式化压缩比
  formatCompressionRatio(ratio: number): string {
    if (ratio < 0) return '增大了';
    return `压缩 ${ratio.toFixed(1)}%`;
  }

  // 获取图片压缩建议
  getCompressionSuggestion(file: File): ImageCompressionOptions {
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > 10) {
      // 大文件：激进压缩
      return {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        quality: 0.7,
        format: 'jpeg'
      };
    } else if (fileSizeMB > 5) {
      // 中等文件：适中压缩
      return {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        quality: 0.8,
        format: 'jpeg'
      };
    } else if (fileSizeMB > 1) {
      // 小文件：轻度压缩
      return {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        quality: 0.85,
        format: file.type.includes('png') ? 'png' : 'jpeg'
      };
    } else {
      // 很小的文件：质量优先
      return {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        quality: 0.9,
        format: file.type.includes('png') ? 'png' : 'jpeg'
      };
    }
  }
}

export const imageCompressionService = new ImageCompressionService();