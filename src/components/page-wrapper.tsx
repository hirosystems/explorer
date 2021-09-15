import React from 'react';
import { useChainModeEffect } from '@common/hooks/use-chain-mode';

export const PageWrapper: React.FC = ({ children }) => {
  useChainModeEffect();
  return <>{children}</>;
};
