import React from 'react';
import { AddNetworkModal } from '@components/modals/add-network';
import { SafeSuspense } from '@components/ssr-safe-suspense';

export const Modals: React.FC = () => {
  return (
    <>
      <SafeSuspense fallback={<></>}>
        <AddNetworkModal />
      </SafeSuspense>
    </>
  );
};
