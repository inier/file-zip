import React from 'react';
import { FolderIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>
          <h1 className={styles.headerTitle}>{title}</h1>
          {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <div className={styles.headerIcon}>
            <FolderIcon />
          </div>
        </div>
      </div>
    </header>
  );
};