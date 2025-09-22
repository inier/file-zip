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
    
    // 浏览器检测详细信息
    mediaQueryStandalone: window.matchMedia('(display-mode: standalone)').matches,
    iOSStandalone: (window.navigator as any).standalone,
    isHTTPS: location.protocol === 'https:',
    
    // 额外的检测信息
    webdriver: (navigator as any).webdriver,
    fromAndroidApp: document.referrer.includes('android-app://'),
    hasStandaloneParam: window.location.search.includes('standalone=true'),
    
    // 环境信息
    userAgent: navigator.userAgent.substring(0, 50) + '...',
    referrer: document.referrer || 'empty',
    currentURL: window.location.href,
    localStorage: localStorage.getItem('pwa-installed'),
    
    // 窗口和屏幕信息
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    screenSize: `${screen.width}x${screen.height}`,
    devicePixelRatio: window.devicePixelRatio
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '12px',
      fontSize: '11px',
      maxWidth: '350px',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 9999,
      fontFamily: 'Monaco, Consolas, monospace',
      border: '2px solid #4CAF50',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h4 style={{ 
        margin: '0 0 12px 0', 
        color: '#4CAF50', 
        fontSize: '13px',
        borderBottom: '1px solid #4CAF50',
        paddingBottom: '5px'
      }}>PWA Debug Info</h4>
      {Object.entries(debugInfo).map(([key, value]) => {
        const displayValue = typeof value === 'boolean' 
          ? (value ? '✅ true' : '❌ false')
          : String(value);
        
        const isImportant = ['isStandalone', 'mediaQueryStandalone', 'isInstalled'].includes(key);
        
        return (
          <div key={key} style={{ 
            marginBottom: '6px',
            padding: '2px 0',
            borderLeft: isImportant ? '3px solid #FFD700' : 'none',
            paddingLeft: isImportant ? '8px' : '0'
          }}>
            <strong style={{ color: isImportant ? '#FFD700' : '#87CEEB' }}>
              {key}:
            </strong>
            <span style={{ marginLeft: '5px', color: isImportant ? '#FFD700' : 'white' }}>
              {displayValue}
            </span>
          </div>
        );
      })}
      <div style={{
        marginTop: '10px',
        fontSize: '10px',
        color: '#888',
        borderTop: '1px solid #333',
        paddingTop: '5px'
      }}>
        刷新页面或重新安装PWA查看变化
      </div>
    </div>
  );
};