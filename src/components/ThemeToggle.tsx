import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { themeStore, Theme } from '../store/ThemeStore';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle: React.FC = observer(() => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: '浅色主题', icon: '☀️' },
    { value: 'dark', label: '深色主题', icon: '🌙' },
    { value: 'auto', label: '跟随系统', icon: '🌓' }
  ];

  const handleThemeSelect = (theme: Theme) => {
    themeStore.setTheme(theme);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.themeToggle}>
      <button
        className={styles.themeButton}
        onClick={toggleDropdown}
        title={`当前主题: ${themeStore.themeLabel}`}
        aria-label="切换主题"
      >
        <span className={styles.themeIcon}>{themeStore.themeIcon}</span>
        <span className={styles.themeLabel}>{themeStore.themeLabel}</span>
        <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>

      {isDropdownOpen && (
        <div className={styles.themeDropdown}>
          {themes.map((theme) => (
            <button
              key={theme.value}
              className={`${styles.themeOption} ${
                themeStore.currentTheme === theme.value ? styles.active : ''
              }`}
              onClick={() => handleThemeSelect(theme.value)}
            >
              <span className={styles.themeOptionIcon}>{theme.icon}</span>
              <span className={styles.themeOptionLabel}>{theme.label}</span>
              {themeStore.currentTheme === theme.value && (
                <span className={styles.themeOptionCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isDropdownOpen && (
        <div
          className={styles.themeOverlay}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
});