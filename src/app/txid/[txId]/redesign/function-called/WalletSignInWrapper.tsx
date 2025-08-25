'use client';

import { useUser } from '@/app/sandbox/hooks/useUser';
import { Button } from '@/ui/Button';
import { ReactNode } from 'react';

export const WalletSignInWrapper = ({ children }: { children: ReactNode }) => {
  const { isConnected, connect } = useUser();
  return isConnected ? (
    children
  ) : (
    <Button variant="redesignPrimary" onClick={connect}>
      Connect Stacks Wallet
    </Button>
  );
};
