'use client';

import { ReactNode, createContext, useContext } from 'react';

import { RecentBlocks } from './data';

interface HomePageDataContextType {
  recentBlocks: RecentBlocks;
}

const DEFAULT_HOME_PAGE_DATA: HomePageDataContextType = {
  recentBlocks: {
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
  recentBlocks?: RecentBlocks;
}

export function HomePageDataProvider({
  children,
  recentBlocks = DEFAULT_HOME_PAGE_DATA.recentBlocks,
}: HomePageDataProviderProps) {
  const contextValue = {
    recentBlocks,
  };

  return (
    <HomePageDataContext.Provider value={contextValue}>{children}</HomePageDataContext.Provider>
  );
}

export function useHomePageData() {
  return useContext(HomePageDataContext);
}
