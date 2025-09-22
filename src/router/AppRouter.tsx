import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Loading } from '../components/Loading';
import { AppLayout } from '../components/AppLayout';

// 懒加载页面组件
const HomePage = React.lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const CompressionPage = React.lazy(() => import('../pages/CompressionPage').then(module => ({ default: module.CompressionPage })));
const ImageCompressionPage = React.lazy(() => import('../pages/ImageCompressionPage').then(module => ({ default: module.ImageCompressionPage })));
const DecompressionPage = React.lazy(() => import('../pages/DecompressionPage').then(module => ({ default: module.DecompressionPage })));

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AppLayout>
          <Suspense fallback={<Loading message="正在加载页面..." size="large" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/compress" element={<CompressionPage />} />
              <Route path="/image-compress" element={<ImageCompressionPage />} />
              <Route path="/decompress" element={<DecompressionPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </ErrorBoundary>
    </Router>
  );
};

// 404页面组件
const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '4rem 2rem',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.8)' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
        页面未找到
      </p>
      <a 
        href="/"
        style={{
          padding: '0.8rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: '500'
        }}
      >
        返回首页
      </a>
    </div>
  );
};