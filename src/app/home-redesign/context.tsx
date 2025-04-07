'use client';

import { ReactNode, createContext, useContext } from 'react';

import { RecentBlocks, UIStackingCycle } from './data';

interface HomePageDataContextType {
  stxPrice: number;
  initialRecentBlocks: RecentBlocks;
  stackingCycle: UIStackingCycle;
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
    startBlockHeight: 0,
    endBlockHeight: 0,
  },
};

const HomePageDataContext = createContext<HomePageDataContextType>(DEFAULT_HOME_PAGE_DATA);

interface HomePageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
  initialRecentBlocks?: RecentBlocks;
  stackingCycle?: UIStackingCycle;
}

export function HomePageDataProvider({
  children,
  stxPrice = DEFAULT_HOME_PAGE_DATA.stxPrice,
  initialRecentBlocks = DEFAULT_HOME_PAGE_DATA.initialRecentBlocks,
  stackingCycle = DEFAULT_HOME_PAGE_DATA.stackingCycle,
}: HomePageDataProviderProps) {
  const contextValue = {
    stxPrice,
    initialRecentBlocks,
    stackingCycle,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
