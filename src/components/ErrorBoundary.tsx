import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorIcon } from '../components/icons';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <ErrorIcon width={64} height={64} />
            </div>
            
            <h2 className={styles.errorTitle}>页面加载出错</h2>
            
            <p className={styles.errorMessage}>
              {this.state.error?.message || '发生了意外错误，请稍后重试'}
            </p>
            
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton}
                onClick={this.handleRetry}
              >
                重新加载
              </button>
              
              <button 
                className={styles.homeButton}
                onClick={() => window.location.href = '/'}
              >
                返回首页
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className={styles.errorDetails}>
                <summary>错误详情 (开发模式)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}