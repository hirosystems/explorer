import React from 'react';
import { useChainModeEffect } from '@common/hooks/use-chain-mode';
import { Modals } from '@components/modals';

export const PageWrapper: React.FC = ({ children }) => {
  useChainModeEffect();
  return (
    <>
      {children}
      <Modals />
    </>
  );
};
