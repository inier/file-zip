import React from 'react';
import { FilePackageIcon, ImageOptimizeIcon, FileExtractIcon } from './icons';
import styles from './TabNavigation.module.scss';

type TabType = 'compress' | 'image-compress' | 'decompress';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'compress' as TabType,
      label: '文件打包',
      icon: <FilePackageIcon />,
    },
    {
      id: 'image-compress' as TabType,
      label: '图片优化',
      icon: <ImageOptimizeIcon />,
    },
    {
      id: 'decompress' as TabType,
      label: '文件解压',
      icon: <FileExtractIcon />,
    },
  ];

  return (
    <div className={styles.tabButtons}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};