'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0d0d0d',
          color: '#f0ece4',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
        success: {
          duration: 3000,
          style: {
            borderColor: '#1a4d38',
            borderLeftWidth: '4px',
            borderLeftColor: '#1a4d38',
          },
        },
        error: {
          duration: 4000,
          style: {
            borderColor: '#c4773a',
            borderLeftWidth: '4px',
            borderLeftColor: '#c4773a',
          },
        },
        loading: {
          style: {
            background: '#0d0d0d',
          },
        },
      }}
    />
  );
}
