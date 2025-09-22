import { FileItem, CompressedFile, fileStore } from '../store/FileStore';
import { compressionService, CompressionOptions } from './CompressionService';

export interface BatchOperation {
  id: string;
  type: 'compress' | 'decompress' | 'convert';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  files: FileItem[];
  options?: CompressionOptions;
  result?: CompressedFile;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface BatchProcessingOptions {
  concurrency?: number; // 并发处理数量
  chunkSize?: number; // 每批处理的文件数量
  retryCount?: number; // 重试次数
  onProgress?: (operation: BatchOperation) => void;
  onComplete?: (operation: BatchOperation) => void;
  onError?: (operation: BatchOperation, error: Error) => void;
}

export class BatchFileService {
  private operations = new Map<string, BatchOperation>();
  private processingQueue: BatchOperation[] = [];
  private isProcessing = false;

  // 创建批量压缩任务
  async createBatchCompressionTask(
    fileGroups: FileItem[][],
    options: CompressionOptions,
    batchOptions: BatchProcessingOptions = {}
  ): Promise<string[]> {
    const operationIds: string[] = [];

    for (let i = 0; i < fileGroups.length; i++) {
      const files = fileGroups[i];
      const operationId = `batch-compress-${Date.now()}-${i}`;
      
      const operation: BatchOperation = {
        id: operationId,
        type: 'compress',
        status: 'pending',
        progress: 0,
        files,
        options: {
          ...options,
          fileName: options.fileName || `batch_${i + 1}_${Date.now()}.${options.format}`
        }
      };

      this.operations.set(operationId, operation);
      this.processingQueue.push(operation);
      operationIds.push(operationId);
    }

    // 开始处理队列
    this.processQueue(batchOptions);
    
    return operationIds;
  }

  // 智能文件分组
  groupFilesBySize(files: FileItem[], maxGroupSizeMB: number = 50): FileItem[][] {
    const groups: FileItem[][] = [];
    let currentGroup: FileItem[] = [];
    let currentGroupSize = 0;

    // 按文件大小排序（大文件优先）
    const sortedFiles = [...files].sort((a, b) => b.size - a.size);

    for (const file of sortedFiles) {
      const fileSizeMB = file.size / (1024 * 1024);
      
      // 如果当前文件太大，单独成组
      if (fileSizeMB > maxGroupSizeMB) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
          currentGroupSize = 0;
        }
        groups.push([file]);
        continue;
      }

      // 如果添加当前文件会超过限制，先保存当前组
      if (currentGroupSize + fileSizeMB > maxGroupSizeMB && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
        currentGroupSize = 0;
      }

      currentGroup.push(file);
      currentGroupSize += fileSizeMB;
    }

    // 保存最后一组
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  // 按文件类型分组
  groupFilesByType(files: FileItem[]): Map<string, FileItem[]> {
    const groups = new Map<string, FileItem[]>();

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      
      if (!groups.has(extension)) {
        groups.set(extension, []);
      }
      
      groups.get(extension)!.push(file);
    }

    return groups;
  }

  // 处理队列
  private async processQueue(options: BatchProcessingOptions = {}) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    const { concurrency = 2, retryCount = 3 } = options;

    try {
      // 并发处理
      const promises: Promise<void>[] = [];
      
      for (let i = 0; i < Math.min(concurrency, this.processingQueue.length); i++) {
        promises.push(this.processNextOperation(options, retryCount));
      }

      await Promise.all(promises);
    } finally {
      this.isProcessing = false;
    }
  }

  // 处理下一个操作
  private async processNextOperation(
    options: BatchProcessingOptions,
    retriesLeft: number
  ): Promise<void> {
    while (this.processingQueue.length > 0) {
      const operation = this.processingQueue.shift();
      if (!operation) break;

      try {
        await this.executeOperation(operation, options);
      } catch (error) {
        if (retriesLeft > 0) {
          console.warn(`操作 ${operation.id} 失败，重试中... (剩余 ${retriesLeft} 次)`);
          // 重新加入队列重试
          this.processingQueue.unshift(operation);
          await this.processNextOperation(options, retriesLeft - 1);
        } else {
          operation.status = 'failed';
          operation.error = error instanceof Error ? error.message : '未知错误';
          operation.endTime = Date.now();
          
          if (options.onError) {
            options.onError(operation, error as Error);
          }
        }
      }
    }
  }

  // 执行单个操作
  private async executeOperation(
    operation: BatchOperation,
    options: BatchProcessingOptions
  ): Promise<void> {
    operation.status = 'processing';
    operation.startTime = Date.now();
    operation.progress = 0;

    try {
      if (options.onProgress) {
        options.onProgress(operation);
      }

      // 更新全局进度
      fileStore.setProcessing(true);
      fileStore.setCurrentOperation(`正在处理批量任务: ${operation.id}`);

      let result: CompressedFile;

      switch (operation.type) {
        case 'compress':
          if (!operation.options) {
            throw new Error('压缩选项未设置');
          }
          result = await compressionService.compressFiles(operation.files, operation.options);
          break;
        default:
          throw new Error(`不支持的操作类型: ${operation.type}`);
      }

      operation.result = result;
      operation.status = 'completed';
      operation.progress = 100;
      operation.endTime = Date.now();

      if (options.onComplete) {
        options.onComplete(operation);
      }

    } catch (error) {
      operation.status = 'failed';
      operation.error = error instanceof Error ? error.message : '未知错误';
      operation.endTime = Date.now();
      throw error;
    }
  }

  // 获取操作状态
  getOperation(operationId: string): BatchOperation | undefined {
    return this.operations.get(operationId);
  }

  // 获取所有操作
  getAllOperations(): BatchOperation[] {
    return Array.from(this.operations.values());
  }

  // 取消操作
  cancelOperation(operationId: string): boolean {
    const operation = this.operations.get(operationId);
    if (!operation || operation.status === 'completed' || operation.status === 'failed') {
      return false;
    }

    operation.status = 'failed';
    operation.error = '用户取消';
    operation.endTime = Date.now();

    // 从队列中移除
    const queueIndex = this.processingQueue.findIndex(op => op.id === operationId);
    if (queueIndex > -1) {
      this.processingQueue.splice(queueIndex, 1);
    }

    return true;
  }

  // 清理已完成的操作
  clearCompletedOperations(): void {
    for (const [id, operation] of this.operations.entries()) {
      if (operation.status === 'completed' || operation.status === 'failed') {
        this.operations.delete(id);
      }
    }
  }

  // 获取统计信息
  getStatistics(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    totalProcessingTime: number;
    averageProcessingTime: number;
  } {
    const operations = this.getAllOperations();
    const completed = operations.filter(op => op.status === 'completed');
    
    const totalProcessingTime = completed.reduce((sum, op) => {
      return sum + ((op.endTime || 0) - (op.startTime || 0));
    }, 0);

    return {
      total: operations.length,
      pending: operations.filter(op => op.status === 'pending').length,
      processing: operations.filter(op => op.status === 'processing').length,
      completed: completed.length,
      failed: operations.filter(op => op.status === 'failed').length,
      totalProcessingTime,
      averageProcessingTime: completed.length > 0 ? totalProcessingTime / completed.length : 0
    };
  }

  // 批量下载结果
  downloadAllResults(): void {
    const completedOperations = this.getAllOperations()
      .filter(op => op.status === 'completed' && op.result);

    for (const operation of completedOperations) {
      if (operation.result) {
        compressionService.downloadFile(operation.result.blob, operation.result.name);
      }
    }
  }

  // 估计处理时间
  estimateProcessingTime(files: FileItem[], options: CompressionOptions): number {
    const stats = this.getStatistics();
    const avgTimePerMB = stats.averageProcessingTime / 1024 / 1024 || 100; // 默认每MB 100ms
    
    const totalSizeMB = files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
    
    // 根据格式调整估计时间
    const formatMultiplier = {
      'zip': 1,
      'gzip': 0.8,
      'deflate': 0.9,
      '7z': 1.5,
      'rar': 1.2
    }[options.format] || 1;

    return totalSizeMB * avgTimePerMB * formatMultiplier;
  }
}

export const batchFileService = new BatchFileService();