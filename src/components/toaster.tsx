import React from 'react';
import { Toaster as ToasterBase, Portal } from '@stacks/ui';

import { useToast } from '@common/hooks/use-toast';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return (
    <Portal>
      <ToasterBase toasts={toasts} removeToast={removeToast} />
    </Portal>
  );
};

export default Toaster;
