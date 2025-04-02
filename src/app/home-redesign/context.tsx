'use client';

import { ReactNode, createContext, useContext } from 'react';

import { RecentBlocks } from './data';

interface HomePageDataContextType {
  initialRecentBlocks: RecentBlocks;
}

const DEFAULT_HOME_PAGE_DATA: HomePageDataContextType = {
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
  },
};

const HomePageDataContext = createContext<HomePageDataContextType>(DEFAULT_HOME_PAGE_DATA);

interface HomePageDataProviderProps {
  children: ReactNode;
  initialRecentBlocks?: RecentBlocks;
}

export function HomePageDataProvider({
  children,
  initialRecentBlocks = DEFAULT_HOME_PAGE_DATA.initialRecentBlocks,
}: HomePageDataProviderProps) {
  const contextValue = {
    initialRecentBlocks,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
