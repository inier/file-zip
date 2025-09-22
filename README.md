# 文件压缩解压工具

一个现代化的网页文件压缩和解压缩工具，支持多种格式的文件压缩、图片优化和文件解压，使用 React 19 + Rsbuild + MobX + TypeScript 构建。

![React](https://img.shields.io/badge/React-19-blue) ![Rsbuild](https://img.shields.io/badge/Rsbuild-1.5-green) ![MobX](https://img.shields.io/badge/MobX-6-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![CSS Modules](https://img.shields.io/badge/CSS%20Modules-支持-purple)

## 🚀 功能特性

### 📦 文件打包压缩
- ✅ **多格式支持**: ZIP、GZIP、Deflate
- ✅ **拖拽上传**: 支持直接拖拽文件到网页
- ✅ **批量压缩**: 可同时压缩多个文件（包括图片）
- ✅ **压缩级别**: 0-9级可调节压缩强度
- ✅ **实时预览**: 显示文件列表和压缩统计
- ✅ **进度显示**: 实时显示压缩进度和操作状态

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
- ✅ **格式识别**: 自动识别压缩文件格式
- ✅ **内容预览**: 查看压缩包内文件列表和详细信息
- ✅ **选择性提取**: 可选择特定文件进行提取
- ✅ **批量下载**: 支持下载提取的文件
- ✅ **文件类型识别**: 智能显示文件图标和类型

### 🎨 用户体验
- ✅ **现代UI**: 美观的渐变背景和毛玻璃效果
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
- **React Compiler**: 支持（自动优化和内存化）
- **React Scan**: 集成（开发环境性能分析）
- **压缩库**: 
  - JSZip (ZIP格式压缩)
  - fflate (GZIP/Deflate格式压缩)
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
1. 选择"文件打包"标签页
2. 拖拽文件到上传区域或点击选择文件
3. 支持上传任意类型文件（包括图片、文档、视频等）
4. 在文件列表中查看已选择的文件
5. 配置压缩设置：
   - 选择压缩格式 (ZIP/GZIP/Deflate)
   - 调整压缩级别 (0-9)
   - 设置文件名 (可选)
6. 点击"开始压缩"按钮
7. 在压缩文件列表中下载压缩包

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
1. 选择"文件解压"标签页
2. 点击"选择压缩文件"上传压缩包
3. 查看压缩包内容列表和文件详细信息
4. 选择要提取的文件 (可全选或单选)
5. 点击"提取文件"按钮下载

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
│   └── *.module.scss            # CSS Modules 样式文件
├── services/                     # 业务逻辑服务
│   ├── CompressionService.ts     # 文件压缩解压服务
│   └── ImageCompressionService.ts # 图片压缩服务
├── store/                        # MobX 状态管理
│   └── FileStore.ts             # 文件状态管理（数据源分离）
├── hooks/                        # 自定义 Hooks
│   └── useFileClassification.ts  # 文件分类逻辑
├── styles/                       # 全局样式
│   ├── _variables.scss          # SCSS 变量
│   └── _mixins.scss             # SCSS 混入
├── types/                        # TypeScript 类型定义
│   └── css-modules.d.ts         # CSS Modules 类型声明
├── utils/                        # 工具函数
│   └── constants.ts             # 常量定义
├── App.tsx                      # 主应用组件
├── App.module.scss              # 主应用样式
├── index.tsx                    # 应用入口
└── index.html                   # HTML 模板
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

## 🔧 核心功能实现

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

## 🔮 功能路线图

### 已完成 ✅
- [x] 基础文件压缩功能
- [x] 图片压缩优化功能
- [x] 文件解压缩功能
- [x] 数据源分离架构
- [x] CSS Modules 样式隔离
- [x] TypeScript 完整支持
- [x] 响应式 UI 设计

### 计划中 🚧
- [ ] 支持更多压缩格式（RAR, 7z）
- [ ] 批量文件操作优化
- [ ] 云端存储集成
- [ ] PWA 支持
- [ ] 主题切换功能

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