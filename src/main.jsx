import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { logger } from '@/services/logger';

// Global error handling for production stability
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.critical('Global runtime error', { message: event.message, source: event.filename });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.critical('Unhandled promise rejection', { reason: event.reason });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
