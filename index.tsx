
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

console.log('[AgriFlow] index.tsx executing...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('[AgriFlow] root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('[AgriFlow] render() called');
