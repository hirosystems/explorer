'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const NetworkModeToast: React.FC = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          width: '540px',
          height: '68px',
          fontSize: '16px',
          color: 'bg',
          backgroundColor: 'invert',
        },
      }}
    />
  );
};
