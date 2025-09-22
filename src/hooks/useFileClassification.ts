import { fileStore } from '../store/FileStore';
import { imageCompressionService } from '../services/ImageCompressionService';

/**
 * 文件分类Hook
 * 根据当前选择的标签页自动将文件添加到对应的数据源
 */
export const useFileClassification = () => {
  
  /**
   * 根据当前标签页自动分类添加文件
   * @param fileList 文件列表
   * @param activeTab 当前活动标签页
   */
  const addFilesForTab = (
    fileList: FileList | File[], 
    activeTab: 'compress' | 'image-compress' | 'decompress'
  ) => {
    const files = Array.from(fileList);
    
    if (activeTab === 'compress') {
      // 文件压缩页面：接受所有类型的文件（包括图片）
      if (files.length > 0) {
        fileStore.addCompressionFiles(files);
      }
      
    } else if (activeTab === 'image-compress') {
      // 图片压缩页面：只接受图片文件
      const imageFiles = files.filter(file => 
        imageCompressionService.isImageFile(file)
      );
      
      if (imageFiles.length > 0) {
        fileStore.addImageFiles(imageFiles);
      }
      
      // 如果有非图片文件，给出提示
      const nonImageFiles = files.filter(file => 
        !imageCompressionService.isImageFile(file)
      );
      if (nonImageFiles.length > 0) {
        fileStore.setError(
          `检测到 ${nonImageFiles.length} 个非图片文件，普通文件请在"文件压缩"标签页中处理`
        );
      }
    }
    // decompress 标签页不需要添加到store，直接进行解压操作
  };

  /**
   * 清理当前标签页的文件
   * @param activeTab 当前活动标签页
   */
  const clearFilesForTab = (activeTab: 'compress' | 'image-compress' | 'decompress') => {
    if (activeTab === 'compress') {
      fileStore.clearCompressionFiles();
    } else if (activeTab === 'image-compress') {
      fileStore.clearImageFiles();
    }
  };

  /**
   * 移除当前标签页的特定文件
   * @param fileId 文件ID
   * @param activeTab 当前活动标签页
   */
  const removeFileForTab = (
    fileId: string, 
    activeTab: 'compress' | 'image-compress' | 'decompress'
  ) => {
    if (activeTab === 'compress') {
      fileStore.removeCompressionFile(fileId);
    } else if (activeTab === 'image-compress') {
      fileStore.removeImageFile(fileId);
    }
  };

  /**
   * 获取当前标签页的文件列表
   * @param activeTab 当前活动标签页
   * @returns 文件列表
   */
  const getFilesForTab = (activeTab: 'compress' | 'image-compress' | 'decompress') => {
    if (activeTab === 'compress') {
      return fileStore.compressionFiles;
    } else if (activeTab === 'image-compress') {
      return fileStore.imageFiles;
    }
    return [];
  };

  /**
   * 获取当前标签页的文件总大小
   * @param activeTab 当前活动标签页
   * @returns 总大小（字节）
   */
  const getTotalSizeForTab = (activeTab: 'compress' | 'image-compress' | 'decompress') => {
    if (activeTab === 'compress') {
      return fileStore.compressionTotalSize;
    } else if (activeTab === 'image-compress') {
      return fileStore.imagesTotalSize;
    }
    return 0;
  };

  return {
    addFilesForTab,
    clearFilesForTab,
    removeFileForTab,
    getFilesForTab,
    getTotalSizeForTab,
  };
};