import React from 'react';
import { Toaster } from 'react-hot-toast';

import { color } from '@stacks/ui';

export const NetworkModeToast: React.FC = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          width: '540px',
          height: '68px',
          fontSize: '16px',
          color: color('bg'),
          backgroundColor: color('invert'),
        },
      }}
    />
  );
};
