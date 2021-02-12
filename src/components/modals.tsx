import React from 'react';
import { SearchModal } from '@components/modals/search';
import { NetworkSwitchModal } from '@components/modals/add-network';
import { DifferentNetworkModal } from '@components/modals/different-network';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';

export const Modals: React.FC = () => {
  return (
    <>
      <SearchModal />
      <NetworkSwitchModal />
      <DifferentNetworkModal />
      <UnlockingScheduleModal />
    </>
  );
};
