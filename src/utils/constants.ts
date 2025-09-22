export const SUPPORTED_FORMATS = {
  compress: {
    'zip': {
      name: 'ZIP',
      description: '最常用的压缩格式，兼容性最好',
      extensions: ['.zip'],
      maxFiles: Infinity,
      maxSize: 500 * 1024 * 1024 // 500MB
    },
    'gzip': {
      name: 'GZIP',
      description: '单文件高效压缩，Linux常用',
      extensions: ['.gz', '.gzip'],
      maxFiles: 1,
      maxSize: 100 * 1024 * 1024 // 100MB
    },
    'deflate': {
      name: 'Deflate',
      description: '轻量级压缩算法',
      extensions: ['.deflate'],
      maxFiles: Infinity,
      maxSize: 200 * 1024 * 1024 // 200MB
    }
  },
  decompress: {
    'zip': ['.zip'],
    'gzip': ['.gz', '.gzip'],
    'rar': ['.rar'],
    '7z': ['.7z'],
    'tar': ['.tar']
  }
};

export const FILE_SIZE_LIMITS = {
  single: 100 * 1024 * 1024,  // 100MB per file
  total: 500 * 1024 * 1024,   // 500MB total
  archive: 1024 * 1024 * 1024 // 1GB for archives
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: '文件大小超过限制',
  TOTAL_SIZE_TOO_LARGE: '文件总大小超过限制',
  UNSUPPORTED_FORMAT: '不支持的文件格式',
  COMPRESSION_FAILED: '压缩失败',
  DECOMPRESSION_FAILED: '解压失败',
  NETWORK_ERROR: '网络错误',
  UNKNOWN_ERROR: '未知错误'
};

export const getFileExtension = (filename: string): string => {
  return filename.toLowerCase().split('.').pop() || '';
};

export const isValidArchive = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return Object.values(SUPPORTED_FORMATS.decompress)
    .flat()
    .some(supportedExt => supportedExt.slice(1) === ext);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatCompressionRatio = (ratio: number): string => {
  if (ratio < 0) return '0%';
  return `${Math.round(ratio)}%`;
};

export const validateFiles = (files: File[], format?: string): { valid: File[], errors: string[] } => {
  const valid: File[] = [];
  const errors: string[] = [];

  let totalSize = 0;

  for (const file of files) {
    // 检查单个文件大小
    if (file.size > FILE_SIZE_LIMITS.single) {
      errors.push(`文件 "${file.name}" 超过大小限制 (${formatBytes(FILE_SIZE_LIMITS.single)})`);
      continue;
    }

    // 检查总大小
    totalSize += file.size;
    if (totalSize > FILE_SIZE_LIMITS.total) {
      errors.push(`文件总大小超过限制 (${formatBytes(FILE_SIZE_LIMITS.total)})`);
      break;
    }

    // 格式特定验证
    if (format === 'gzip' && files.length > 1) {
      errors.push('GZIP格式只支持压缩单个文件');
      break;
    }

    valid.push(file);
  }

  return { valid, errors };
};

export const generateFileName = (format: string, originalName?: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const baseName = originalName ? originalName.split('.')[0] : 'compressed';
  
  switch (format) {
    case 'zip':
      return `${baseName}_${timestamp}.zip`;
    case 'gzip':
      return `${baseName}_${timestamp}.gz`;
    case 'deflate':
      return `${baseName}_${timestamp}.deflate`;
    default:
      return `${baseName}_${timestamp}.${format}`;
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};