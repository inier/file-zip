import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = observer(({ title, subtitle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>
          <h1 className={styles.headerTitle}>{title}</h1>
          {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.headerIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <polyline
              points="14,2 14,8 20,8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polyline
              points="10,9 9,9 8,9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
});