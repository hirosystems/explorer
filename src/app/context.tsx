'use client';

import { FeeCalculationTypes, Fees } from '@leather.io/models';
import { ReactNode, createContext, useContext } from 'react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types';

import { RecentBlocks, UIMempoolStats, UIStackingCycle } from './data';

interface Fee {
  no_priority: number;
  low_priority: number;
  medium_priority: number;
  high_priority: number;
}

export interface FeeEstimates {
  tokenTransferFees: Fee;
  contractCallFees: Fee;
  contractDeployFees: Fee;
  averageFees: Fee;
}

interface HomePageDataContextType {
  stxPrice: number;
  initialRecentBlocks?: RecentBlocks;
  stackingCycle?: UIStackingCycle;
  mempoolStats?: UIMempoolStats;
  feeEstimates?: FeeEstimates;
  isSSRDisabled: boolean;
}

const DEFAULT_HOME_PAGE_DATA: HomePageDataContextType = {
  stxPrice: 0,
  initialRecentBlocks: undefined,
  stackingCycle: undefined,
  mempoolStats: undefined,
  feeEstimates: undefined,
  isSSRDisabled: false,
};

const HomePageDataContext = createContext<HomePageDataContextType>(DEFAULT_HOME_PAGE_DATA);

export function HomePageDataProvider({
  children,
  stxPrice = DEFAULT_HOME_PAGE_DATA.stxPrice,
  initialRecentBlocks = DEFAULT_HOME_PAGE_DATA.initialRecentBlocks,
  stackingCycle = DEFAULT_HOME_PAGE_DATA.stackingCycle,
  mempoolStats = DEFAULT_HOME_PAGE_DATA.mempoolStats,
  feeEstimates,
  isSSRDisabled = DEFAULT_HOME_PAGE_DATA.isSSRDisabled,
}: HomePageDataContextType & { children: ReactNode }) {
  const contextValue = {
    stxPrice,
    initialRecentBlocks,
    stackingCycle,
    mempoolStats,
    feeEstimates,
    isSSRDisabled,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
