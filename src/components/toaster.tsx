import React from 'react';
import { Toaster as ToasterBase, Portal } from '@blockstack/ui';

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
