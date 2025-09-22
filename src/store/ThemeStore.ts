import { makeAutoObservable } from 'mobx';

export type Theme = 'light' | 'dark' | 'auto';

export class ThemeStore {
  currentTheme: Theme = 'auto';
  systemPrefersDark = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  private initializeTheme() {
    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }

    // 检测系统主题偏好
    this.systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme();
  }

  private setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      this.systemPrefersDark = e.matches;
      if (this.currentTheme === 'auto') {
        this.applyTheme();
      }
    };

    // 使用兼容性更好的方式监听
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // 兼容老版本浏览器
      mediaQuery.addListener(handler);
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  private applyTheme() {
    const isDark = this.getEffectiveTheme() === 'dark';
    
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // 同时设置类名以兼容CSS类选择器
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    
    // 设置meta标签以影响状态栏颜色（移动端）
    this.updateMetaThemeColor(isDark);
  }

  private updateMetaThemeColor(isDark: boolean) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    const color = isDark ? '#1a1a1a' : '#667eea';
    metaThemeColor.setAttribute('content', color);
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      return this.systemPrefersDark ? 'dark' : 'light';
    }
    return this.currentTheme as 'light' | 'dark';
  }

  get themeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🌓';
      default:
        return '🌓';
    }
  }

  get themeLabel(): string {
    switch (this.currentTheme) {
      case 'light':
        return '浅色主题';
      case 'dark':
        return '深色主题';
      case 'auto':
        return '跟随系统';
      default:
        return '跟随系统';
    }
  }
}

export const themeStore = new ThemeStore();