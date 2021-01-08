import React from 'react';
import { SearchModal } from '@components/modals/search';
import { NetworkSwitchModal } from '@components/modals/add-network';

export const Modals: React.FC = () => {
  return (
    <>
      <SearchModal />
      <NetworkSwitchModal />
    </>
  );
};
