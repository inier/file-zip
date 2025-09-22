import React, { useState } from 'react';
import { usePWAInstall, useServiceWorker } from '../hooks/usePWA';
import styles from './PWAInstall.module.scss';

export const PWAInstall: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, promptInstall } = usePWAInstall();
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await promptInstall();
      if (success) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      console.error('安装失败:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    await updateServiceWorker();
  };

  // 如果已安装且没有更新，不显示组件
  if ((isInstalled || isStandalone) && !isUpdateAvailable) {
    return null;
  }

  return (
    <div className={styles.pwaContainer}>
      {/* 安装提示 */}
      {isInstallable && !isInstalled && (
        <div className={styles.installPrompt}>
          <div className={styles.promptContent}>
            <div className={styles.promptText}>
              <h3>安装应用到主屏幕</h3>
              <p>获得更好的体验，支持离线使用</p>
            </div>
            <div className={styles.promptActions}>
              <button
                className={styles.installButton}
                onClick={handleInstall}
                disabled={isInstalling}
              >
                {isInstalling ? '安装中...' : '安装'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 更新提示 */}
      {isUpdateAvailable && (
        <div className={styles.updatePrompt}>
          <div className={styles.promptContent}>
            <div className={styles.promptText}>
              <h3>新版本可用</h3>
              <p>有新功能和改进可用</p>
            </div>
            <div className={styles.promptActions}>
              <button
                className={styles.updateButton}
                onClick={handleUpdate}
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 安装成功通知 */}
      {showNotification && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <span>✅ 应用安装成功！</span>
          </div>
        </div>
      )}

      {/* PWA 功能展示 */}
      {!isStandalone && (
        <div className={styles.pwaFeatures}>
          <h4>PWA 功能特性</h4>
          <ul>
            <li>✨ 快速加载和响应</li>
            <li>📱 原生应用体验</li>
            <li>🔧 离线功能支持</li>
            <li>🚀 自动更新</li>
            <li>💾 缓存优化</li>
          </ul>
        </div>
      )}
    </div>
  );
};