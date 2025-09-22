import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FilePackageIcon, ImageOptimizeIcon, FileExtractIcon } from './icons';
import styles from './Navigation.module.scss';

const navigationItems = [
  {
    path: '/',
    label: '首页',
    icon: null,
    exact: true
  },
  {
    path: '/compress',
    label: '文件压缩',
    icon: <FilePackageIcon />,
    exact: false
  },
  {
    path: '/image-compress',
    label: '图片压缩',
    icon: <ImageOptimizeIcon />,
    exact: false
  },
  {
    path: '/decompress',
    label: '文件解压',
    icon: <FileExtractIcon />,
    exact: false
  }
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end={item.exact}
          >
            {item.icon && (
              <span className={styles.navIcon}>
                {item.icon}
              </span>
            )}
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};