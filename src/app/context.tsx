'use client';

import { FeeCalculationTypes, Fees } from '@leather.io/models';
import { ReactNode, createContext, useContext } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

import { RecentBlocks, UIMempoolStats, UIStackingCycle } from './data';

interface Fee {
  low_priority: number;
  medium_priority: number;
  high_priority: number;
}

interface HomePageDataContextType {
  stxPrice: number;
  initialRecentBlocks: RecentBlocks;
  stackingCycle: UIStackingCycle;
  mempoolStats: UIMempoolStats;
  feeEstimates: {
    tokenTransferFees: Fee;
    contractCallFees: Fee;
    contractDeployFees: Fee;
    averageFees: Fee;
  };
}

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
  mempoolStats: {
    tx_type_counts: {
      token_transfer: 0,
      smart_contract: 0,
      contract_call: 0,
      poison_microblock: 0,
    },
  },
  feeEstimates: {
    tokenTransferFees: {
      low_priority: 0,
      medium_priority: 0,
      high_priority: 0,
    },
    contractCallFees: {
      low_priority: 0,
      medium_priority: 0,
      high_priority: 0,
    },
    contractDeployFees: {
      low_priority: 0,
      medium_priority: 0,
      high_priority: 0,
    },
    averageFees: {
      low_priority: 0,
      medium_priority: 0,
      high_priority: 0,
    },
  },
};

const HomePageDataContext = createContext<HomePageDataContextType>(DEFAULT_HOME_PAGE_DATA);

export function HomePageDataProvider({
  children,
  stxPrice = DEFAULT_HOME_PAGE_DATA.stxPrice,
  initialRecentBlocks = DEFAULT_HOME_PAGE_DATA.initialRecentBlocks,
  stackingCycle = DEFAULT_HOME_PAGE_DATA.stackingCycle,
  mempoolStats = DEFAULT_HOME_PAGE_DATA.mempoolStats,
  feeEstimates,
}: HomePageDataContextType & { children: ReactNode }) {
  const contextValue = {
    stxPrice,
    initialRecentBlocks,
    stackingCycle,
    mempoolStats,
    feeEstimates,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
