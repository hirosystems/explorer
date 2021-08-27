import React from 'react';
import { SearchModal } from '@components/modals/search';
import { AddNetworkModal } from '@components/modals/add-network';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { SafeSuspense } from '@components/ssr-safe-suspense';

export const Modals: React.FC = () => {
  return (
    <>
      <SafeSuspense fallback={<></>}>
        <SearchModal />
        <UnlockingScheduleModal />
      </SafeSuspense>
      <AddNetworkModal />
    </>
  );
};
