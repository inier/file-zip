import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWAInstall = () => {
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    installPrompt: null
  });

  useEffect(() => {
    // 更健壮的独立模式检测
    const checkStandaloneMode = () => {
      // 方法1: CSS媒体查询检测
      const standaloneQuery = window.matchMedia('(display-mode: standalone)');
      
      // 方法2: iOS Safari检测
      const iosSafariStandalone = (window.navigator as any).standalone === true;
      
      // 方法3: Android应用检测
      const androidApp = document.referrer.includes('android-app://');
      
      // 方法4: 检查URL中是否有特定参数（某些浏览器会添加）
      const urlStandalone = window.location.search.includes('standalone=true');
      
      const isStandalone = standaloneQuery.matches || iosSafariStandalone || androidApp || urlStandalone;
      
      // 调试信息
      console.log('PWA Standalone 检测:', {
        mediaQuery: standaloneQuery.matches,
        iosSafari: iosSafariStandalone,
        androidApp,
        urlParam: urlStandalone,
        finalResult: isStandalone
      });
      
      return isStandalone;
    };

    const isStandalone = checkStandaloneMode();
    
    // 检查是否已安装（结合多种方式）
    const storageInstalled = localStorage.getItem('pwa-installed') === 'true';
    const isInstalled = isStandalone || storageInstalled;

    setState(prev => ({
      ...prev,
      isStandalone,
      isInstalled
    }));

    // 监听媒体查询变化
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      console.log('Display mode 变化:', e.matches);
      setState(prev => ({
        ...prev,
        isStandalone: e.matches,
        isInstalled: e.matches || storageInstalled
      }));
    };
    
    // 兼容性处理
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', handleDisplayModeChange);
    } else {
      // 兼容老版本浏览器
      standaloneQuery.addListener(handleDisplayModeChange);
    }

    // 监听安装提示事件
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // 阻止默认的安装提示
      e.preventDefault();
      
      setState(prev => ({
        ...prev,
        isInstallable: !prev.isInstalled,
        installPrompt: e
      }));
    };

    // 监听应用安装事件
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 清理函数
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      
      // 移除媒体查询监听器
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener('change', handleDisplayModeChange);
      } else {
        standaloneQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  // 触发安装
  const promptInstall = async () => {
    if (!state.installPrompt) {
      return false;
    }

    try {
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;
      
      setState(prev => ({
        ...prev,
        installPrompt: null,
        isInstallable: false
      }));

      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('PWA 安装失败:', error);
      return false;
    }
  };

  return {
    ...state,
    promptInstall
  };
};

// Service Worker 注册 Hook
export const useServiceWorker = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      setRegistration(reg);
      setIsRegistered(true);

      // 监听 Service Worker 更新
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdateAvailable(true);
            }
          });
        }
      });

      console.log('Service Worker 注册成功');
    } catch (error) {
      console.error('Service Worker 注册失败:', error);
    }
  };

  const updateServiceWorker = async () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return {
    isRegistered,
    isUpdateAvailable,
    updateServiceWorker
  };
};