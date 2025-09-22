import { makeAutoObservable } from 'mobx';
import type { CompressedImageResult } from '../services/ImageCompressionService';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  lastModified: number;
}

export interface CompressedFile {
  id: string;
  name: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
  format: string;
  blob: Blob;
  createdAt: number;
}

export interface ArchiveEntry {
  name: string;
  size: number;
  compressedSize: number;
  isDirectory: boolean;
  lastModified: Date;
}

export class FileStore {
  // 文件压缩相关数据
  compressionFiles: FileItem[] = [];
  compressedFiles: CompressedFile[] = [];
  
  // 图片压缩相关数据
  imageFiles: FileItem[] = [];
  compressedImages: CompressedImageResult[] = [];
  
  // 解压缩相关数据
  currentArchiveEntries: ArchiveEntry[] = [];
  
  // 共享的状态管理
  isProcessing = false;
  progress = 0;
  currentOperation = '';
  error: string | null = null;

  // 废弃的files属性，保持向后兼容
  get files() {
    console.warn('⚠️ files属性已废弃，请使用compressionFiles或imageFiles');
    return [...this.compressionFiles, ...this.imageFiles];
  }

  constructor() {
    makeAutoObservable(this);
  }

  // === 文件压缩相关方法 ===
  addCompressionFiles(fileList: FileList | File[]) {
    const newFiles: FileItem[] = Array.from(fileList).map(file => ({
      id: `comp-${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      lastModified: file.lastModified,
    }));

    this.compressionFiles.push(...newFiles);
  }

  removeCompressionFile(id: string) {
    this.compressionFiles = this.compressionFiles.filter(file => file.id !== id);
  }

  clearCompressionFiles() {
    this.compressionFiles = [];
  }

  // === 图片压缩相关方法 ===
  addImageFiles(fileList: FileList | File[]) {
    const newFiles: FileItem[] = Array.from(fileList).map(file => ({
      id: `img-${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      lastModified: file.lastModified,
    }));

    this.imageFiles.push(...newFiles);
  }

  removeImageFile(id: string) {
    this.imageFiles = this.imageFiles.filter(file => file.id !== id);
  }

  clearImageFiles() {
    this.imageFiles = [];
  }

  // === 废弃的通用方法（保持向后兼容）===
  addFiles(fileList: FileList | File[]) {
    console.warn('⚠️ addFiles方法已废弃，请使用addCompressionFiles或addImageFiles');
    // 默认添加到文件压缩列表中以保持兼容性
    this.addCompressionFiles(fileList);
  }

  removeFile(id: string) {
    console.warn('⚠️ removeFile方法已废弃，请使用removeCompressionFile或removeImageFile');
    this.removeCompressionFile(id);
    this.removeImageFile(id);
  }

  clearFiles() {
    console.warn('⚠️ clearFiles方法已废弃，请使用clearCompressionFiles或clearImageFiles');
    this.clearCompressionFiles();
    this.clearImageFiles();
  }

  addCompressedFile(compressedFile: CompressedFile) {
    this.compressedFiles.push(compressedFile);
  }

  removeCompressedFile(id: string) {
    this.compressedFiles = this.compressedFiles.filter(file => file.id !== id);
  }

  clearCompressedFiles() {
    this.compressedFiles = [];
  }

  addCompressedImage(compressedImage: CompressedImageResult) {
    this.compressedImages.push(compressedImage);
  }

  addCompressedImages(compressedImages: CompressedImageResult[]) {
    this.compressedImages.push(...compressedImages);
  }

  removeCompressedImage(id: string) {
    this.compressedImages = this.compressedImages.filter(image => image.id !== id);
  }

  clearCompressedImages() {
    this.compressedImages = [];
  }

  setArchiveEntries(entries: ArchiveEntry[]) {
    this.currentArchiveEntries = entries;
  }

  setProcessing(isProcessing: boolean) {
    this.isProcessing = isProcessing;
  }

  setProgress(progress: number) {
    this.progress = Math.max(0, Math.min(100, progress));
  }

  setCurrentOperation(operation: string) {
    this.currentOperation = operation;
  }

  setError(error: string | null) {
    this.error = error;
  }

  resetProgress() {
    this.progress = 0;
    this.currentOperation = '';
    this.error = null;
  }

  // === 计算属性 ===
  get compressionTotalSize() {
    return this.compressionFiles.reduce((sum, file) => sum + file.size, 0);
  }

  get imagesTotalSize() {
    return this.imageFiles.reduce((sum, file) => sum + file.size, 0);
  }

  // 废弃的totalSize属性（保持向后兼容）
  get totalSize() {
    console.warn('⚠️ totalSize属性已废弃，请使用compressionTotalSize或imagesTotalSize');
    return this.compressionTotalSize + this.imagesTotalSize;
  }

  get totalCompressedSize() {
    return this.compressedFiles.reduce((sum, file) => sum + file.size, 0);
  }

  get totalCompressedImageSize() {
    return this.compressedImages.reduce((sum, image) => sum + image.compressedSize, 0);
  }

  get totalOriginalImageSize() {
    return this.compressedImages.reduce((sum, image) => sum + image.originalSize, 0);
  }

  get overallCompressionRatio() {
    if (this.compressedFiles.length === 0) return 0;
    const totalOriginalSize = this.compressedFiles.reduce((sum, file) => sum + file.originalSize, 0);
    const totalCompressedSize = this.compressedFiles.reduce((sum, file) => sum + file.size, 0);
    return totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;
  }

  get overallImageCompressionRatio() {
    if (this.compressedImages.length === 0) return 0;
    const totalOriginalSize = this.totalOriginalImageSize;
    const totalCompressedSize = this.totalCompressedImageSize;
    return totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;
  }
}

export const fileStore = new FileStore();