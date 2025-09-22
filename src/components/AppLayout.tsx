import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { GlobalError } from './GlobalError';
import { GlobalProgress } from './GlobalProgress';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={styles.appLayout}>
      <div className={styles.container}>
        <Header 
          title="文件压缩解压工具" 
          subtitle="支持ZIP、GZIP、Deflate等多种格式的文件压缩和解压缩"
        />
        
        {!isHomePage && (
          <Navigation />
        )}
        
        <main className={styles.main}>
          {children}
        </main>

        <GlobalError />
        <GlobalProgress />
      </div>
    </div>
  );
};