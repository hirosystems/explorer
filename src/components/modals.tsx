import React from 'react';
import { SearchModal } from '@components/modals/search';
import { AddNetworkModal } from '@components/modals/add-network';
import { SafeSuspense } from '@components/ssr-safe-suspense';

export const Modals: React.FC = () => {
  return (
    <>
      <SafeSuspense fallback={<></>}>
        <SearchModal />
        <AddNetworkModal />
      </SafeSuspense>
    </>
  );
};
