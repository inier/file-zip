import React from 'react';
import { observer } from 'mobx-react-lite';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { CompressionPanel } from './CompressionPanel';
import { ImageCompressionPanel } from './ImageCompressionPanel';
import { CompressedFileList } from './CompressedFileList';
import { CompressedImageList } from './CompressedImageList';
import { DecompressionPanel } from './DecompressionPanel';
import { useFileClassification } from '../hooks/useFileClassification';
import styles from './TabContent.module.scss';

type TabType = 'compress' | 'image-compress' | 'decompress';

interface TabContentProps {
  activeTab: TabType;
}

export const TabContent: React.FC<TabContentProps> = observer(({ activeTab }) => {
  const { getFilesForTab } = useFileClassification();
  const currentFiles = getFilesForTab(activeTab);

  return (
    <div className={styles.tabContent}>
      {activeTab === 'compress' && (
        <div className={styles.compressionTab}>
          <FileUpload 
            activeTab={activeTab}
            accept="*/*"
            multiple={true}
          />
          {currentFiles.length > 0 && <FileList activeTab={activeTab} />}
          <CompressionPanel />
          <CompressedFileList />
        </div>
      )}

      {activeTab === 'image-compress' && (
        <div className={styles.imageCompressionTab}>
          <FileUpload 
            activeTab={activeTab}
            accept="image/*"
            multiple={true}
          />
          {currentFiles.length > 0 && <FileList activeTab={activeTab} />}
          <ImageCompressionPanel />
          <CompressedImageList />
        </div>
      )}

      {activeTab === 'decompress' && (
        <div className={styles.decompressionTab}>
          <DecompressionPanel />
        </div>
      )}
    </div>
  );
});