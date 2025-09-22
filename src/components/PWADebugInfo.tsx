import React from 'react';
import { usePWAInstall, useServiceWorker } from '../hooks/usePWA';

export const PWADebugInfo: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, installPrompt } = usePWAInstall();
  const { isRegistered, isUpdateAvailable } = useServiceWorker();

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const debugInfo = {
    // PWA 状态
    isInstallable,
    isInstalled,
    isStandalone,
    hasInstallPrompt: !!installPrompt,
    
    // Service Worker 状态
    serviceWorkerRegistered: isRegistered,
    updateAvailable: isUpdateAvailable,
    
    // 浏览器检测
    mediaQueryStandalone: window.matchMedia('(display-mode: standalone)').matches,
    iOSStandalone: (window.navigator as any).standalone,
    isHTTPS: location.protocol === 'https:',
    
    // 其他信息
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    currentURL: window.location.href,
    localStorage: localStorage.getItem('pwa-installed')
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>PWA Debug Info</h4>
      {Object.entries(debugInfo).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '4px' }}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ))}
    </div>
  );
};