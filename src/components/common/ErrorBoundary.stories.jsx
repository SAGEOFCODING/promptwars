import ErrorBoundary from './ErrorBoundary';
import React from 'react';

export default {
  title: 'Common/ErrorBoundary',
  component: ErrorBoundary,
};

const ProblematicComponent = () => {
  throw new Error('Test Error');
};

export const Default = () => (
  <ErrorBoundary>
    <div>This should render fine.</div>
  </ErrorBoundary>
);

export const WithError = () => (
  <ErrorBoundary>
    <ProblematicComponent />
  </ErrorBoundary>
);
