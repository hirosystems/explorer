import React from 'react';
import { SearchModal } from '@components/modals/search';
import { AddNetworkModal } from '@components/modals/add-network';

export const Modals: React.FC = () => {
  return (
    <>
      <SearchModal />
      <AddNetworkModal />
    </>
  );
};
