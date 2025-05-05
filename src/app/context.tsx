'use client';

import { ReactNode, createContext, useContext } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

import { RecentBlocks, UIMempoolStats, UIStackingCycle } from './data';

interface HomePageDataContextType {
  stxPrice: number;
  initialRecentBlocks: RecentBlocks;
  stackingCycle: UIStackingCycle;
  mempoolFee: MempoolFeePriorities;
  mempoolStats: UIMempoolStats;
}

const DEFAULT_MEMPOOL_FEE = {
  no_priority: 0,
  low_priority: 0,
  medium_priority: 0,
  high_priority: 0,
};

const DEFAULT_HOME_PAGE_DATA: HomePageDataContextType = {
  stxPrice: 0,
  initialRecentBlocks: {
    btcBlocks: {
      results: [],
      total: 0,
      limit: 0,
      offset: 0,
    },
    stxBlocks: {
      results: [],
      total: 0,
      limit: 0,
      offset: 0,
    },
    stxBlocksCountPerBtcBlock: [],
  },
  stackingCycle: {
    cycleId: 0,
    stackedStx: 0,
    progressPercentage: 0,
    blocksTilNextCycle: 0,
    approximateDaysTilNextCycle: 0,
    approximateStartTimestamp: 0,
    approximateEndTimestamp: 0,
    rewardCycleLength: 0,
    startBurnBlockHeight: 0,
    startBurnBlockHash: '',
    startStacksBlockHeight: 0,
    startStacksBlockHash: '',
    endBurnBlockHeight: 0,
  },
  mempoolFee: {
    all: DEFAULT_MEMPOOL_FEE,
    token_transfer: DEFAULT_MEMPOOL_FEE,
    smart_contract: DEFAULT_MEMPOOL_FEE,
    contract_call: DEFAULT_MEMPOOL_FEE,
  },
  mempoolStats: {
    tx_type_counts: {
      token_transfer: 0,
      smart_contract: 0,
      contract_call: 0,
      poison_microblock: 0,
    },
  },
};

const HomePageDataContext = createContext<HomePageDataContextType>(DEFAULT_HOME_PAGE_DATA);

interface HomePageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
  initialRecentBlocks?: RecentBlocks;
  stackingCycle?: UIStackingCycle;
  mempoolFee?: MempoolFeePriorities;
  mempoolStats?: UIMempoolStats;
}

export function HomePageDataProvider({
  children,
  stxPrice = DEFAULT_HOME_PAGE_DATA.stxPrice,
  initialRecentBlocks = DEFAULT_HOME_PAGE_DATA.initialRecentBlocks,
  stackingCycle = DEFAULT_HOME_PAGE_DATA.stackingCycle,
  mempoolFee = DEFAULT_HOME_PAGE_DATA.mempoolFee,
  mempoolStats = DEFAULT_HOME_PAGE_DATA.mempoolStats,
}: HomePageDataProviderProps) {
  const contextValue = {
    stxPrice,
    initialRecentBlocks,
    stackingCycle,
    mempoolFee,
    mempoolStats,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
