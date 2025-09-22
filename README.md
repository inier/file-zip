# 文件压缩解压工具

一个现代化的网页文件压缩和解压缩工具，支持多种格式的文件压缩、图片优化和文件解压，使用 React 19 + Rsbuild + MobX + TypeScript 构建。

![React](https://img.shields.io/badge/React-19-blue) ![Rsbuild](https://img.shields.io/badge/Rsbuild-1.5-green) ![MobX](https://img.shields.io/badge/MobX-6-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![CSS Modules](https://img.shields.io/badge/CSS%20Modules-支持-purple)

## 🚀 功能特性

### 📦 文件打包压缩
- ✅ **多格式支持**: ZIP、GZIP、Deflate、7z、RAR（解压）
- ✅ **拖拽上传**: 支持直接拖拽文件到网页
- ✅ **批量压缩**: 可同时压缩多个文件（包括图片）
- ✅ **智能分组**: 按文件大小、类型或手动分组批量处理
- ✅ **并发处理**: 支持并发批量操作，提升处理效率
- ✅ **压缩级别**: 0-9级可调节压缩强度
- ✅ **实时预览**: 显示文件列表和压缩统计
- ✅ **进度显示**: 实时显示压缩进度和操作状态
- ✅ **失败重试**: 自动重试机制和错误处理

### 🖼️ 图片优化压缩
- ✅ **智能压缩**: 基于图片内容优化压缩算法
- ✅ **格式转换**: 支持JPEG、PNG、WebP格式输出
- ✅ **质量控制**: 可调节压缩质量(10%-100%)
- ✅ **尺寸限制**: 支持设置最大宽度/高度(480p-4K)
- ✅ **文件大小控制**: 可设置目标文件大小(0.1MB-10MB)
- ✅ **快速预设**: 高质量、平衡、小文件三种预设模式
- ✅ **批量处理**: 支持同时压缩多张图片
- ✅ **预览对比**: 压缩前后效果实时对比
- ✅ **实时统计**: 显示压缩率和文件大小变化

### 📂 文件解压缩
- ✅ **多格式支持**: ZIP、GZIP、7z、RAR等主流格式
- ✅ **格式识别**: 自动识别压缩文件格式
- ✅ **内容预览**: 查看压缩包内文件列表和详细信息
- ✅ **选择性提取**: 可选择特定文件进行提取
- ✅ **批量下载**: 支持下载提取的文件
- ✅ **文件类型识别**: 智能显示文件图标和类型

### 🎨 用户体验
- ✅ **现代UI**: 美观的渐变背景和毛玻璃效果
- ✅ **主题切换**: 支持浅色、深色、自动三种主题模式
- ✅ **PWA支持**: 支持安装到设备，离线可用
- ✅ **三标签页**: 文件打包、图片优化、文件解压独立功能
- ✅ **响应式设计**: 完美适配移动端和桌面端
- ✅ **错误处理**: 友好的错误提示和处理
- ✅ **智能识别**: 自动区分图片文件和普通文件
- ✅ **数据隔离**: 各功能独立的文件管理，切换无干扰

## 🛠️ 技术栈

- **框架**: React 19 (最新版本)
- **构建工具**: Rsbuild 1.5
- **状态管理**: MobX 6
- **语言**: TypeScript 5.9
- **样式方案**: SCSS + CSS Modules (样式隔离)
- **PWA支持**: Service Worker + 应用清单
- **主题系统**: 自动主题检测 + 手动切换
- **React Compiler**: 支持（自动优化和内存化）
- **React Scan**: 集成（开发环境性能分析）
- **压缩库**: 
  - JSZip (ZIP格式压缩)
  - fflate (GZIP/Deflate格式压缩)
  - 7z-wasm (7z格式支持)
  - libarchive.js (RAR等多格式支持)
  - browser-image-compression (图片压缩优化)

## 📦 安装与运行

### 环境要求
- Node.js >= 16
- npm >= 7

### 快速开始
```bash
# 克隆项目
git clone <repository-url>
cd image-zip

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 可用脚本
```bash
# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 🎯 使用指南

### 📦 文件打包压缩
1. 选择“文件打包”标签页
2. 拖拽文件到上传区域或点击选择文件
3. 支持上传任意类型文件（包括图片、文档、视频等）
4. 在文件列表中查看已选择的文件
5. **批量处理配置** （多个文件时显示）：
   - 选择分组方式（按大小/类型/手动）
   - 设置最大组大小
   - 查看智能分组预览
   - 配置并发处理数量
6. 配置压缩设置：
   - 选择压缩格式 (ZIP/GZIP/Deflate/7z)
   - 调整压缩级别 (0-9)
   - 设置文件名 (可选)
7. 点击“开始压缩”或“开始批量处理”按钮
8. 在压缩文件列表中下载压缩包

### 🖼️ 图片优化压缩
1. 选择"图片优化"标签页
2. 拖拽图片文件到上传区域或点击选择文件
3. 选择快速预设：
   - **高质量**: 保持最佳画质，适合摄影作品
   - **平衡**: 质量与大小平衡，适合日常使用
   - **小文件**: 最小文件大小，适合网络传输
4. 或手动调整设置：
   - 选择输出格式 (JPEG/PNG/WebP)
   - 调整图片质量 (10%-100%)
   - 设置最大文件大小 (0.1MB-10MB)
   - 选择最大尺寸 (480p-4K)
5. 点击"压缩图片"开始处理
6. 在压缩结果列表中查看效果并下载

### 📂 文件解压缩
1. 选择“文件解压”标签页
2. 点击“选择压缩文件”上传压缩包
3. 支持格式：ZIP、GZIP、7z、RAR等主流压缩格式
4. 查看压缩包内容列表和文件详细信息
5. 选择要提取的文件 (可全选或单选)
6. 点击“提取文件”按钮下载

## 📁 项目结构

```
src/
├── components/                    # React 组件
│   ├── Header.tsx                # 页面头部组件
│   ├── FileUpload.tsx            # 文件上传组件（支持拖拽）
│   ├── FileList.tsx              # 文件列表组件
│   ├── CompressionPanel.tsx      # 文件压缩控制面板
│   ├── ImageCompressionPanel.tsx # 图片压缩控制面板
│   ├── CompressedFileList.tsx    # 压缩文件列表
│   ├── CompressedImageList.tsx   # 压缩图片列表
│   ├── DecompressionPanel.tsx    # 解压缩面板
│   ├── BatchProcessor.tsx        # 批量处理组件
│   ├── ThemeToggle.tsx           # 主题切换组件
│   ├── PWAInstall.tsx            # PWA安装组件
│   └── *.module.scss            # CSS Modules 样式文件
├── services/                     # 业务逻辑服务
│   ├── CompressionService.ts     # 文件压缩解压服务
│   ├── ImageCompressionService.ts # 图片压缩服务
│   └── BatchFileService.ts       # 批量文件处理服务
├── store/                        # MobX 状态管理
│   ├── FileStore.ts             # 文件状态管理（数据源分离）
│   └── ThemeStore.ts            # 主题状态管理
├── hooks/                        # 自定义 Hooks
│   ├── useFileClassification.ts  # 文件分类逻辑
│   └── usePWA.ts                # PWA功能集成
├── styles/                       # 全局样式
│   ├── _variables.scss          # SCSS 变量和主题CSS变量
│   └── _mixins.scss             # SCSS 混入
├── types/                        # TypeScript 类型定义
│   └── css-modules.d.ts         # CSS Modules 类型声明
├── utils/                        # 工具函数
│   └── constants.ts             # 常量定义
├── pages/                        # 页面组件
│   ├── HomePage.tsx             # 主页
│   ├── CompressionPage.tsx      # 文件压缩页
│   ├── ImageCompressionPage.tsx # 图片压缩页
│   └── DecompressionPage.tsx    # 文件解压页
├── router/                       # 路由配置
│   └── AppRouter.tsx            # 主路由组件
├── App.tsx                      # 主应用组件
├── App.module.scss              # 主应用样式
├── index.tsx                    # 应用入口
└── index.html                   # HTML 模板（PWA配置）
```

## 🎨 设计特色

### UI/UX 设计
- **现代渐变背景**: 紫蓝色渐变，营造科技感
- **毛玻璃效果**: backdrop-filter 实现的现代毛玻璃效果
- **流畅动画**: smooth hover 和 loading 动画交互
- **SVG 图标**: 矢量化图标，高清显示
- **响应式布局**: 完美适配各种屏幕尺寸

### 技术特色
- **CSS Modules**: 完全的样式隔离，避免类名冲突
- **TypeScript**: 完整的类型安全和智能提示
- **React Compiler**: 自动优化React组件，无需手动useMemo
- **数据源分离**: 文件压缩和图片压缩独立的数据管理
- **智能文件分类**: 自动识别文件类型并引导用户

## 🔧 开发环境支持

### React Scan 性能分析
项目在开发模式下集成了 **React Scan** 性能分析工具，能够自动检测和可视化组件重新渲染问题。

#### 功能特性
- **自动检测**: 无需手动配置，自动识别不必要的重新渲染
- **可视化标记**: 在页面上直接高亮显示有问题的组件
- **控制台日志**: 详细的性能分析信息输出到开发者控制台
- **零依赖**: 通过远程 CDN 加载，不影响生产构建

#### 使用方法
1. 启动开发服务器: `npm run dev`
2. 打开浏览器开发者工具 (F12)
3. 在 Console 中查看性能分析日志
4. 观察页面上的组件高亮标记

#### 技术实现
```typescript
// Rsbuild 配置中的远程脚本集成
const getReactScanTags = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    return [{
      tag: 'script',
      attrs: {
        src: 'https://unpkg.com/react-scan/dist/auto.global.js',
        async: true,
      },
      append: false,
    }];
  }
  
  return [];
};
```

此配置确保 React Scan 仅在开发环境下加载，不会影响生产构建的性能和包大小。

## 🔧 技术详情

### PWA 配置
项目完整支持 Progressive Web App 特性：

```json
// public/manifest.json - 应用清单
{
  "name": "文件压缩解压工具",
  "short_name": "文件压缩",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#667eea",
  "background_color": "#667eea"
}
```

```javascript
// public/sw.js - Service Worker
// 实现离线缓存、自动更新、推送通知等功能
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

### 主题系统架构
基于 CSS 变量和 MobX 状态管理的主题系统：

```scss
// 主题 CSS 变量定义
:root {
  &[data-theme="light"] {
    --bg-color: #ffffff;
    --text-color: #333333;
    --border-color: #e0e0e0;
  }
  
  &[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #404040;
  }
}
```

### 批量处理架构
高效的批量文件处理系统：

```typescript
// 批量处理服务
export class BatchFileService {
  // 智能文件分组
  groupFilesBySize(files: FileItem[], maxGroupSizeMB: number = 50): FileItem[][] {
    // 按文件大小排序（大文件优先）
    const sortedFiles = [...files].sort((a, b) => b.size - a.size);
    // 智能分组算法...
  }
  
  // 并发处理队列
  async processQueue(options: BatchProcessingOptions = {}) {
    const { concurrency = 2, retryCount = 3 } = options;
    // 并发处理逻辑...
  }
}
```

### 🎨 主题切换系统
```typescript
// 自动主题检测和切换
export class ThemeStore {
  currentTheme: Theme = 'auto';
  systemPrefersDark = false;

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      return this.systemPrefersDark ? 'dark' : 'light';
    }
    return this.currentTheme as 'light' | 'dark';
  }
}
```

### 📱 PWA Service Worker
```javascript
// 智能缓存策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存优先，网络回退
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

### ⚡ 批量处理算法
```typescript
// 智能文件分组
groupFilesBySize(files: FileItem[], maxGroupSizeMB: number = 50): FileItem[][] {
  const groups: FileItem[][] = [];
  let currentGroup: FileItem[] = [];
  let currentGroupSize = 0;

  // 按文件大小排序（大文件优先）
  const sortedFiles = [...files].sort((a, b) => b.size - a.size);
  
  // 智能分组逻辑...
}

// 并发处理
async processQueue(options: BatchProcessingOptions = {}) {
  const { concurrency = 2, retryCount = 3 } = options;
  
  const promises: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrency, this.processingQueue.length); i++) {
    promises.push(this.processNextOperation(options, retryCount));
  }
  
  await Promise.all(promises);
}
```

### 🗃️ 格式扩展支持
```typescript
// 动态格式检测
private detectFormat(file: File): string {
  const name = file.name.toLowerCase();
  
  if (name.endsWith('.zip')) return 'zip';
  if (name.endsWith('.gz') || name.endsWith('.gzip')) return 'gzip';
  if (name.endsWith('.7z')) return '7z';
  if (name.endsWith('.rar')) return 'rar';
  
  return 'unknown';
}

// 多格式压缩支持
switch (options.format) {
  case 'zip':
    result = await this.compressToZip(files, options);
    break;
  case '7z':
    result = await this.compressTo7z(files, options);
    break;
  case 'rar':
    throw new Error('RAR 格式仅支持解压，不支持压缩');
  default:
    throw new Error(`不支持的压缩格式: ${options.format}`);
}
```

### React Compiler 自动优化
```typescript
// React Compiler 自动优化组件，无需手动 useMemo
export const FileList: React.FC<FileListProps> = observer(({ activeTab }) => {
  const { getFilesForTab, getTotalSizeForTab } = useFileClassification();
  
  // 编译器自动优化这些计算
  const currentFiles = getFilesForTab(activeTab);
  const currentTotalSize = getTotalSizeForTab(activeTab);
  
  // 组件渲染会被自动内存化
  return (
    <div className={styles.fileList}>
      {/* ... */}
    </div>
  );
});
```

### 数据源分离架构
```typescript
export class FileStore {
  // 文件压缩相关数据
  compressionFiles: FileItem[] = [];
  compressedFiles: CompressedFile[] = [];
  
  // 图片压缩相关数据
  imageFiles: FileItem[] = [];
  compressedImages: CompressedImageResult[] = [];
  
  // 解压缩相关数据
  currentArchiveEntries: ArchiveEntry[] = [];
}
```

### 智能文件分类
```typescript
export const useFileClassification = () => {
  const addFilesForTab = (fileList, activeTab) => {
    if (activeTab === 'compress') {
      // 文件压缩页面：接受所有类型的文件（包括图片）
      fileStore.addCompressionFiles(files);
    } else if (activeTab === 'image-compress') {
      // 图片压缩页面：只接受图片文件
      const imageFiles = files.filter(file => 
        imageCompressionService.isImageFile(file)
      );
      fileStore.addImageFiles(imageFiles);
    }
  };
};
```

### 文件拖拽上传
```typescript
const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragOver(false);
  setDragCounter(0);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    addFilesForTab(files, activeTab);
    onFilesAdded?.(files);
  }
}, [activeTab, addFilesForTab, onFilesAdded]);
```

### 压缩算法实现
```typescript
// ZIP 压缩
const zip = new JSZip();
for (const fileItem of files) {
  const progress = ((index + 1) / totalFiles) * 100;
  fileStore.setProgress(progress);
  
  zip.file(fileItem.name, fileItem.file);
}

const zipBlob = await zip.generateAsync({
  type: 'blob',
  compression: 'DEFLATE',
  compressionOptions: { level: options.level }
});
```

### CSS Modules 样式隔离
```typescript
// 每个组件使用独立的样式模块
import styles from './Component.module.scss';

// 类名自动生成 hash，避免冲突
<div className={styles.container}>
  <button className={`${styles.button} ${styles.primary}`}>
    按钮
  </button>
</div>
```

## 🌟 特性优势

1. **高性能**: Rsbuild 快速构建和热重载开发体验
2. **类型安全**: 完整的 TypeScript 类型支持和智能提示
3. **响应式状态**: MobX 实现的高效响应式状态管理
4. **样式隔离**: CSS Modules 避免样式冲突
5. **用户友好**: 直观的操作界面和实时进度反馈
6. **跨平台**: 纯网页实现，无需安装任何软件
7. **数据独立**: 各功能模块独立的数据管理
8. **智能引导**: 自动文件分类和用户操作指引
9. **PWA体验**: 支持安装到设备，离线可用
10. **主题适配**: 自动跟随系统主题或手动切换
11. **批量优化**: 智能分组和并发处理，提升效率

## 📈 浏览器兼容性

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## 📊 性能指标

### 构建大小
- **总大小**: 488.0 kB
- **Gzip 压缩后**: 147.3 kB
- **CSS**: 27.4 kB (支持 CSS Modules)
- **JavaScript**: 460.6 kB

### 支持的文件类型
- **图片格式**: JPG, PNG, GIF, WebP, BMP
- **压缩格式**: ZIP, GZIP, Deflate, 7z, RAR, TAR
- **其他文件**: 支持所有文件类型的打包压缩

## 🔮 新特性亮点

### 🎨 主题切换功能
- **三种模式**: 浅色、深色、自动（跟随系统）
- **自动检测**: 智能检测系统主题偏好
- **状态持久化**: 主题选择自动保存
- **实时切换**: 无刷新主题切换体验

### 📱 PWA 支持
- **安装提示**: 智能提示用户安装到桌面
- **离线可用**: Service Worker 实现离线缓存
- **自动更新**: 检测新版本并提示更新
- **原生体验**: 全屏显示，原生应用体验

### ⚡ 批量处理优化
- **智能分组**: 按文件大小、类型自动分组
- **并发处理**: 支持多线程并发操作
- **进度监控**: 实时显示每个任务进度
- **失败重试**: 自动重试机制和错误处理
- **性能统计**: 处理时间和效率分析

### 🗃️ 多格式支持
- **7z 压缩**: 支持 7z 格式压缩和解压
- **RAR 解压**: 支持 RAR 格式文件解压
- **动态检测**: 自动识别文件格式
- **扩展架构**: 易于扩展支持更多格式

## 🚀 快速体验

项目现在已经集成了所有新特性，你可以立即体验：

1. **主题切换**: 点击右上角的主题切换按钮
2. **PWA 安装**: 首页显示的 PWA 安装提示
3. **批量处理**: 在文件压缩页面上传多个文件后显示
4. **多格式支持**: 在压缩设置中选择 7z 格式
5. **响应式设计**: 在不同设备上测试体验

## 🔮 功能路线图

### 已完成 ✅
- [x] 基础文件压缩功能
- [x] 图片压缩优化功能
- [x] 文件解压缩功能
- [x] 数据源分离架构
- [x] CSS Modules 样式隔离
- [x] TypeScript 完整支持
- [x] 响应式 UI 设计
- [x] **主题切换功能** 🆕
- [x] **PWA 支持** 🆕
- [x] **支持更多压缩格式（RAR, 7z）** 🆕
- [x] **批量文件操作优化** 🆕

### 计划中 🚧
- [ ] 更完善的 7z 压缩算法
- [ ] 云端存储集成
- [ ] 多语言支持
- [ ] 更多图片格式支持
- [ ] 性能监控仪表板

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交 Pull Request

### 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 CSS Modules 样式隔离原则
- 使用 MobX 进行状态管理
- 确保响应式设计兼容性

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 参与项目讨论
- 贡献代码改进

---

**享受现代化文件处理的便捷体验！** 🎉✨