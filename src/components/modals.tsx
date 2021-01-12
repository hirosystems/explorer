import React from 'react';
import { SearchModal } from '@components/modals/search';
import { NetworkSwitchModal } from '@components/modals/add-network';
import { DifferentNetworkModal } from '@components/modals/different-network';

export const Modals: React.FC = () => {
  return (
    <>
      <SearchModal />
      <NetworkSwitchModal />
      <DifferentNetworkModal />
    </>
  );
};
