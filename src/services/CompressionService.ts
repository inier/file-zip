import JSZip from 'jszip';
import { gzip, gunzip, compress, decompress } from 'fflate';
import { FileItem, CompressedFile, ArchiveEntry, fileStore } from '../store/FileStore';

export type CompressionFormat = 'zip' | 'gzip' | 'deflate';

export interface CompressionOptions {
  level?: number; // 0-9, 0 = no compression, 9 = maximum compression
  format: CompressionFormat;
  fileName?: string;
}

export class CompressionService {
  
  // 压缩文件
  async compressFiles(files: FileItem[], options: CompressionOptions): Promise<CompressedFile> {
    // 参数验证
    if (!files || files.length === 0) {
      throw new Error('请选择要压缩的文件');
    }

    if (!options.format) {
      throw new Error('请选择压缩格式');
    }

    // GZIP格式特殊验证
    if (options.format === 'gzip' && files.length > 1) {
      throw new Error('GZIP格式只支持压缩单个文件');
    }

    fileStore.setProcessing(true);
    fileStore.setCurrentOperation('正在初始化压缩...');
    fileStore.resetProgress();

    try {
      let result: CompressedFile;

      switch (options.format) {
        case 'zip':
          result = await this.compressToZip(files, options);
          break;
        case 'gzip':
          result = await this.compressToGzip(files[0], options);
          break;
        case 'deflate':
          result = await this.compressToDeflate(files, options);
          break;
        default:
          throw new Error(`不支持的压缩格式: ${options.format}`);
      }

      fileStore.setProgress(100);
      fileStore.setCurrentOperation('压缩完成');
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '压缩过程中出现未知错误';
      fileStore.setError(errorMessage);
      throw error;
    } finally {
      setTimeout(() => {
        fileStore.setProcessing(false);
        fileStore.resetProgress();
      }, 1000);
    }
  }

  // ZIP压缩
  private async compressToZip(files: FileItem[], options: CompressionOptions): Promise<CompressedFile> {
    const zip = new JSZip();
    const totalFiles = files.length;
    let processedFiles = 0;

    fileStore.setCurrentOperation(`正在添加文件到ZIP压缩包... (0/${totalFiles})`);

    // 添加文件到ZIP
    for (const fileItem of files) {
      try {
        const arrayBuffer = await this.fileToArrayBuffer(fileItem.file);
        zip.file(fileItem.name, arrayBuffer);
        
        processedFiles++;
        const progress = (processedFiles / totalFiles) * 80; // 80%用于添加文件
        fileStore.setProgress(progress);
        fileStore.setCurrentOperation(`正在添加文件到ZIP压缩包... (${processedFiles}/${totalFiles})`);
      } catch (error) {
        throw new Error(`处理文件 "${fileItem.name}" 时出错: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    }

    fileStore.setCurrentOperation('正在生成ZIP压缩包...');
    fileStore.setProgress(85);
    
    // 生成ZIP文件
    try {
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: Math.max(1, Math.min(9, options.level || 6)) // 确保压缩级别在有效范围内
        }
      });

      const originalSize = files.reduce((sum, file) => sum + file.size, 0);
      const fileName = options.fileName || `compressed_${Date.now()}.zip`;

      fileStore.setProgress(95);

      return {
        id: `zip-${Date.now()}`,
        name: fileName,
        size: zipBlob.size,
        originalSize,
        compressionRatio: originalSize > 0 ? ((originalSize - zipBlob.size) / originalSize) * 100 : 0,
        format: 'zip',
        blob: zipBlob,
        createdAt: Date.now()
      };
    } catch (error) {
      throw new Error(`生成ZIP文件失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // GZIP压缩
  private async compressToGzip(fileItem: FileItem, options: CompressionOptions): Promise<CompressedFile> {
    fileStore.setCurrentOperation('正在进行GZIP压缩...');
    
    const arrayBuffer = await this.fileToArrayBuffer(fileItem.file);
    const uint8Array = new Uint8Array(arrayBuffer);

    return new Promise((resolve, reject) => {
      gzip(uint8Array, { 
        level: Math.max(0, Math.min(9, options.level || 6)) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 
      }, (err, compressed) => {
        if (err) {
          reject(new Error(`GZIP压缩失败: ${err.message}`));
          return;
        }

        const blob = new Blob([compressed], { type: 'application/gzip' });
        const fileName = options.fileName || `${fileItem.name.split('.')[0]}.gz`;

        resolve({
          id: `gzip-${Date.now()}`,
          name: fileName,
          size: blob.size,
          originalSize: fileItem.size,
          compressionRatio: ((fileItem.size - blob.size) / fileItem.size) * 100,
          format: 'gzip',
          blob,
          createdAt: Date.now()
        });
      });
    });
  }

  // Deflate压缩
  private async compressToDeflate(files: FileItem[], options: CompressionOptions): Promise<CompressedFile> {
    fileStore.setCurrentOperation('正在进行Deflate压缩...');
    
    // 对于多个文件，先创建一个简单的归档格式
    const archive = await this.createSimpleArchive(files);
    
    return new Promise((resolve, reject) => {
      compress(archive, { 
        level: Math.max(0, Math.min(9, options.level || 6)) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 
      }, (err, compressed) => {
        if (err) {
          reject(new Error(`Deflate压缩失败: ${err.message}`));
          return;
        }

        const blob = new Blob([compressed], { type: 'application/deflate' });
        const fileName = options.fileName || `compressed_${Date.now()}.deflate`;
        const originalSize = files.reduce((sum, file) => sum + file.size, 0);

        resolve({
          id: `deflate-${Date.now()}`,
          name: fileName,
          size: blob.size,
          originalSize,
          compressionRatio: ((originalSize - blob.size) / originalSize) * 100,
          format: 'deflate',
          blob,
          createdAt: Date.now()
        });
      });
    });
  }

  // 解压缩文件
  async decompressFile(file: File): Promise<ArchiveEntry[]> {
    fileStore.setProcessing(true);
    fileStore.setCurrentOperation('正在解析压缩文件...');
    fileStore.resetProgress();

    try {
      const format = this.detectFormat(file);
      let entries: ArchiveEntry[] = [];

      switch (format) {
        case 'zip':
          entries = await this.decompressZip(file);
          break;
        case 'gzip':
          entries = await this.decompressGzip(file);
          break;
        default:
          throw new Error(`不支持的文件格式: ${file.name}`);
      }

      fileStore.setArchiveEntries(entries);
      fileStore.setProgress(100);
      fileStore.setCurrentOperation('解析完成');
      return entries;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '解压过程中出现未知错误';
      fileStore.setError(errorMessage);
      throw error;
    } finally {
      setTimeout(() => {
        fileStore.setProcessing(false);
        fileStore.resetProgress();
      }, 1000);
    }
  }

  // 解压ZIP文件
  private async decompressZip(file: File): Promise<ArchiveEntry[]> {
    const zip = await JSZip.loadAsync(file);
    const entries: ArchiveEntry[] = [];

    for (const fileName of Object.keys(zip.files)) {
      const fileObj = zip.files[fileName];
      if (fileObj) {
        // 获取文件的实际大小信息
        const fileData = await fileObj.async('uint8array');
        entries.push({
          name: fileName,
          size: fileData.length, // 解压后大小
          compressedSize: 0, // JSZip doesn't expose internal compressed size
          isDirectory: fileObj.dir,
          lastModified: fileObj.date || new Date()
        });
      }
    }

    return entries;
  }

  // 解压GZIP文件
  private async decompressGzip(file: File): Promise<ArchiveEntry[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const compressed = new Uint8Array(arrayBuffer);

    return new Promise((resolve, reject) => {
      gunzip(compressed, (err, decompressed) => {
        if (err) {
          reject(new Error(`GZIP解压失败: ${err.message}`));
          return;
        }

        const originalName = file.name.replace(/\.gz$/, '');
        resolve([{
          name: originalName,
          size: decompressed.length,
          compressedSize: file.size,
          isDirectory: false,
          lastModified: new Date()
        }]);
      });
    });
  }

  // 提取压缩包中的文件
  async extractFiles(file: File, fileNames?: string[]): Promise<File[]> {
    const format = this.detectFormat(file);
    
    switch (format) {
      case 'zip':
        return this.extractFromZip(file, fileNames);
      case 'gzip':
        return this.extractFromGzip(file);
      default:
        throw new Error(`不支持提取格式: ${format}`);
    }
  }

  // 从ZIP中提取文件
  private async extractFromZip(file: File, fileNames?: string[]): Promise<File[]> {
    const zip = await JSZip.loadAsync(file);
    const extractedFiles: File[] = [];

    const filesToExtract = fileNames || Object.keys(zip.files);

    for (const fileName of filesToExtract) {
      const fileObj = zip.files[fileName];
      if (fileObj && !fileObj.dir) {
        const blob = await fileObj.async('blob');
        extractedFiles.push(new File([blob], fileName, {
          lastModified: fileObj.date?.getTime() || Date.now()
        }));
      }
    }

    return extractedFiles;
  }

  // 从GZIP中提取文件
  private async extractFromGzip(file: File): Promise<File[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const compressed = new Uint8Array(arrayBuffer);

    return new Promise((resolve, reject) => {
      gunzip(compressed, (err, decompressed) => {
        if (err) {
          reject(new Error(`GZIP提取失败: ${err.message}`));
          return;
        }

        const originalName = file.name.replace(/\.gz$/, '');
        const blob = new Blob([decompressed]);
        const extractedFile = new File([blob], originalName);
        resolve([extractedFile]);
      });
    });
  }

  // 检测文件格式
  private detectFormat(file: File): string {
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.zip')) return 'zip';
    if (name.endsWith('.gz') || name.endsWith('.gzip')) return 'gzip';
    if (name.endsWith('.7z')) return '7z';
    if (name.endsWith('.rar')) return 'rar';
    if (name.endsWith('.tar')) return 'tar';
    
    return 'unknown';
  }

  // 工具方法：File转ArrayBuffer
  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });
  }

  // 创建简单的归档格式（用于deflate）
  private async createSimpleArchive(files: FileItem[]): Promise<Uint8Array> {
    // 简单的文件连接，实际项目中可能需要更复杂的归档格式
    const buffers: Uint8Array[] = [];
    
    for (const file of files) {
      const arrayBuffer = await this.fileToArrayBuffer(file.file);
      buffers.push(new Uint8Array(arrayBuffer));
    }

    // 计算总长度
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
    const result = new Uint8Array(totalLength);
    
    // 合并所有文件
    let offset = 0;
    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.length;
    }

    return result;
  }

  // 下载文件
  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    return `${ratio.toFixed(1)}%`;
  }
}

export const compressionService = new CompressionService();