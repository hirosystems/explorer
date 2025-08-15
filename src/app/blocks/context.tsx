'use client';

import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { ReactNode, createContext, useContext } from 'react';

import { BurnBlock } from '@stacks/stacks-blockchain-api-types';

interface BlocksDataContextType {
  initialBtcBlocksData?: { btcBlocks: GenericResponseType<BurnBlock> };
}

const BlocksDataContext = createContext<BlocksDataContextType | undefined>(undefined);

export function useBlocksData() {
  const context = useContext(BlocksDataContext);
  if (context === undefined) {
    throw new Error('useBlocksData must be used within a BlocksDataProvider');
  }
  return context;
}

export function BlocksDataProvider({
  children,
  initialBtcBlocksData,
}: {
  children: ReactNode;
  initialBtcBlocksData?: { btcBlocks: GenericResponseType<BurnBlock> };
}) {
  return (
    <BlocksDataContext.Provider
      value={{
        initialBtcBlocksData,
      }}
    >
      {children}
    </BlocksDataContext.Provider>
  );
}
