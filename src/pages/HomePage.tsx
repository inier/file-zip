import React from 'react';
import { Link } from 'react-router-dom';
import { FilePackageIcon, ImageOptimizeIcon, FileExtractIcon } from '../components/icons';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <FilePackageIcon width={56} height={56} />,
      title: '文件压缩',
      description: '支持ZIP、GZIP、Deflate等多种格式',
      link: '/compress',
      color: '#4CAF50'
    },
    {
      icon: <ImageOptimizeIcon width={56} height={56} />,
      title: '图片压缩',
      description: '智能图片优化，保持质量减小体积',
      link: '/image-compress',
      color: '#2196F3'
    },
    {
      icon: <FileExtractIcon width={56} height={56} />,
      title: '文件解压',
      description: '解压多种压缩格式的文件',
      link: '/decompress',
      color: '#FF9800'
    }
  ];

  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>文件压缩解压工具</h1>
        <p className={styles.heroSubtitle}>
          专业的在线文件处理工具，支持多种格式的压缩和解压缩
        </p>
      </div>

      <div className={styles.features}>
        {features.map((feature, index) => (
          <Link 
            key={index}
            to={feature.link}
            className={styles.featureCard}
            style={{ '--accent-color': feature.color } as React.CSSProperties}
          >
            <div className={styles.featureIcon}>
              {feature.icon}
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
            <div className={styles.featureArrow}>→</div>
          </Link>
        ))}
      </div>

      <div className={styles.info}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h4>🚀 快速处理</h4>
            <p>采用现代化技术，处理速度更快</p>
          </div>
          <div className={styles.infoItem}>
            <h4>🔒 安全可靠</h4>
            <p>本地处理，文件不会上传到服务器</p>
          </div>
          <div className={styles.infoItem}>
            <h4>📱 响应式</h4>
            <p>适配各种设备，随时随地使用</p>
          </div>
          <div className={styles.infoItem}>
            <h4>🎨 现代化UI</h4>
            <p>简洁美观的界面设计</p>
          </div>
        </div>
      </div>
    </div>
  );
};