import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';
import { GlobalError } from './components/GlobalError';
import { GlobalProgress } from './components/GlobalProgress';
import styles from './App.module.scss';

type TabType = 'compress' | 'image-compress' | 'decompress';

const App: React.FC = observer(() => {
  const [activeTab, setActiveTab] = useState<TabType>('compress');

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header 
          title="文件压缩解压工具" 
          subtitle="支持ZIP、GZIP、Deflate等多种格式的文件压缩和解压缩"
        />
        
        <div className={styles.tabContainer}>
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          <TabContent activeTab={activeTab} />
        </div>

        <GlobalError />
        <GlobalProgress />
      </div>
    </div>
  );
});

export default App;