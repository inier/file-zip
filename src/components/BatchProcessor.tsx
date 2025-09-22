import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { FileItem } from '../store/FileStore';
import { batchFileService, BatchOperation } from '../services/BatchFileService';
import { compressionService, CompressionFormat } from '../services/CompressionService';
import styles from './BatchProcessor.module.scss';

interface BatchProcessorProps {
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = observer(({ 
  files, 
  onFilesChange 
}) => {
  const [groupingMethod, setGroupingMethod] = useState<'size' | 'type' | 'manual'>('size');
  const [maxGroupSizeMB, setMaxGroupSizeMB] = useState(50);
  const [compressionFormat, setCompressionFormat] = useState<CompressionFormat>('zip');
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [operations, setOperations] = useState<BatchOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 智能分组预览
  const getFileGroups = useCallback(() => {
    if (files.length === 0) return [];

    switch (groupingMethod) {
      case 'size':
        return batchFileService.groupFilesBySize(files, maxGroupSizeMB);
      case 'type':
        const typeGroups = batchFileService.groupFilesByType(files);
        return Array.from(typeGroups.values());
      case 'manual':
        return [files]; // 手动模式，所有文件一组
      default:
        return [files];
    }
  }, [files, groupingMethod, maxGroupSizeMB]);

  const fileGroups = getFileGroups();

  // 开始批量处理
  const handleStartBatchProcessing = async () => {
    if (fileGroups.length === 0) return;

    setIsProcessing(true);
    
    try {
      const operationIds = await batchFileService.createBatchCompressionTask(
        fileGroups,
        {
          format: compressionFormat,
          level: compressionLevel
        },
        {
          concurrency: 2,
          onProgress: (operation) => {
            setOperations(prev => {
              const index = prev.findIndex(op => op.id === operation.id);
              if (index >= 0) {
                const newOps = [...prev];
                newOps[index] = operation;
                return newOps;
              }
              return [...prev, operation];
            });
          },
          onComplete: (operation) => {
            console.log('操作完成:', operation.id);
          },
          onError: (operation, error) => {
            console.error('操作失败:', operation.id, error);
          }
        }
      );

      // 初始化操作列表
      const initialOps = operationIds.map(id => batchFileService.getOperation(id)!);
      setOperations(initialOps);

    } catch (error) {
      console.error('批量处理启动失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 取消操作
  const handleCancelOperation = (operationId: string) => {
    if (batchFileService.cancelOperation(operationId)) {
      setOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? { ...op, status: 'failed' as const, error: '用户取消' }
            : op
        )
      );
    }
  };

  // 下载所有结果
  const handleDownloadAll = () => {
    batchFileService.downloadAllResults();
  };

  // 清理已完成的操作
  const handleClearCompleted = () => {
    batchFileService.clearCompletedOperations();
    setOperations(prev => prev.filter(op => 
      op.status !== 'completed' && op.status !== 'failed'
    ));
  };

  const statistics = batchFileService.getStatistics();
  const estimatedTime = files.length > 0 
    ? batchFileService.estimateProcessingTime(files, { format: compressionFormat, level: compressionLevel })
    : 0;

  return (
    <div className={styles.batchProcessor}>
      <div className={styles.header}>
        <h3>批量处理配置</h3>
        <p>智能分组和批量压缩，提高处理效率</p>
      </div>

      {/* 分组配置 */}
      <div className={styles.groupingConfig}>
        <div className={styles.configSection}>
          <label className={styles.label}>分组方式</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="size"
                checked={groupingMethod === 'size'}
                onChange={(e) => setGroupingMethod(e.target.value as 'size')}
              />
              按文件大小分组
            </label>
            <label>
              <input
                type="radio"
                value="type"
                checked={groupingMethod === 'type'}
                onChange={(e) => setGroupingMethod(e.target.value as 'type')}
              />
              按文件类型分组
            </label>
            <label>
              <input
                type="radio"
                value="manual"
                checked={groupingMethod === 'manual'}
                onChange={(e) => setGroupingMethod(e.target.value as 'manual')}
              />
              手动分组
            </label>
          </div>
        </div>

        {groupingMethod === 'size' && (
          <div className={styles.configSection}>
            <label className={styles.label}>
              最大组大小: {maxGroupSizeMB}MB
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={maxGroupSizeMB}
              onChange={(e) => setMaxGroupSizeMB(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        )}

        <div className={styles.configSection}>
          <label className={styles.label}>压缩格式</label>
          <select
            value={compressionFormat}
            onChange={(e) => setCompressionFormat(e.target.value as CompressionFormat)}
            className={styles.select}
          >
            <option value="zip">ZIP</option>
            <option value="gzip">GZIP</option>
            <option value="deflate">Deflate</option>
            <option value="7z">7z</option>
          </select>
        </div>

        <div className={styles.configSection}>
          <label className={styles.label}>
            压缩级别: {compressionLevel}
          </label>
          <input
            type="range"
            min="1"
            max="9"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      {/* 分组预览 */}
      {fileGroups.length > 0 && (
        <div className={styles.groupPreview}>
          <h4>分组预览 ({fileGroups.length} 个组)</h4>
          <div className={styles.groupList}>
            {fileGroups.map((group, index) => (
              <div key={index} className={styles.groupItem}>
                <div className={styles.groupHeader}>
                  <span>组 {index + 1}</span>
                  <span>{group.length} 个文件</span>
                  <span>
                    {(group.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
                <div className={styles.groupFiles}>
                  {group.slice(0, 3).map((file, fileIndex) => (
                    <span key={fileIndex} className={styles.fileName}>
                      {file.name}
                    </span>
                  ))}
                  {group.length > 3 && (
                    <span className={styles.moreFiles}>
                      +{group.length - 3} 个文件
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 处理控制 */}
      <div className={styles.processingControls}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>预估时间</span>
            <span>{(estimatedTime / 1000).toFixed(1)}秒</span>
          </div>
          <div className={styles.statItem}>
            <span>待处理</span>
            <span>{files.length} 个文件</span>
          </div>
          <div className={styles.statItem}>
            <span>分组数量</span>
            <span>{fileGroups.length} 组</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.startButton}
            onClick={handleStartBatchProcessing}
            disabled={isProcessing || files.length === 0}
          >
            {isProcessing ? '处理中...' : '开始批量处理'}
          </button>
          
          {operations.length > 0 && (
            <>
              <button
                className={styles.downloadButton}
                onClick={handleDownloadAll}
                disabled={statistics.completed === 0}
              >
                下载所有结果
              </button>
              <button
                className={styles.clearButton}
                onClick={handleClearCompleted}
              >
                清理已完成
              </button>
            </>
          )}
        </div>
      </div>

      {/* 操作列表 */}
      {operations.length > 0 && (
        <div className={styles.operationsList}>
          <h4>处理进度</h4>
          <div className={styles.operationsHeader}>
            <span>进度: {statistics.completed}/{statistics.total}</span>
            <span>
              平均处理时间: {(statistics.averageProcessingTime / 1000).toFixed(1)}秒
            </span>
          </div>
          
          <div className={styles.operations}>
            {operations.map((operation) => (
              <div
                key={operation.id}
                className={`${styles.operationItem} ${styles[operation.status]}`}
              >
                <div className={styles.operationInfo}>
                  <span className={styles.operationName}>
                    {operation.options?.fileName || `批量任务 ${operation.id.split('-').pop()}`}
                  </span>
                  <span className={styles.operationStatus}>
                    {operation.status === 'pending' && '等待中'}
                    {operation.status === 'processing' && '处理中'}
                    {operation.status === 'completed' && '已完成'}
                    {operation.status === 'failed' && '失败'}
                  </span>
                </div>
                
                <div className={styles.operationProgress}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${operation.progress}%` }}
                  />
                </div>
                
                <div className={styles.operationActions}>
                  {operation.status === 'processing' && (
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleCancelOperation(operation.id)}
                    >
                      取消
                    </button>
                  )}
                  {operation.status === 'completed' && operation.result && (
                    <button
                      className={styles.downloadButton}
                      onClick={() => 
                        operation.result && 
                        compressionService.downloadFile(operation.result.blob, operation.result.name)
                      }
                    >
                      下载
                    </button>
                  )}
                </div>
                
                {operation.error && (
                  <div className={styles.operationError}>
                    错误: {operation.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});