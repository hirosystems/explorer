import { createContext, useContext, useState } from 'react';

export enum Timeframe {
  last24h = 'Last 24hs',
  last7d = 'Last 7d',
  last30d = 'Last 30d',
  last360d = 'Last 360d',
  all = 'All',
}

export enum Chart {
  dailyTransactions = 'Daily transactions',
  blocksMined = 'Blocks mined',
  contractsDeployed = 'Contracts deployed',
  activeAddresses = 'Active addresses',
}

interface NetworkOverviewContextType {
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (timeframe: Timeframe) => void;
  selectedChart: Chart;
  setSelectedChart: (chart: Chart) => void;
}

const NetworkOverviewContext = createContext<NetworkOverviewContextType>({
  selectedTimeframe: Timeframe.last24h,
  setSelectedTimeframe: () => {},
  selectedChart: Chart.dailyTransactions,
  setSelectedChart: () => {},
});

export function NetworkOverviewContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(Timeframe.last24h);
  const [selectedChart, setSelectedChart] = useState<Chart>(Chart.dailyTransactions);
  return (
    <NetworkOverviewContext.Provider
      value={{
        selectedTimeframe,
        setSelectedTimeframe,
        selectedChart,
        setSelectedChart,
      }}
    >
      {children}
    </NetworkOverviewContext.Provider>
  );
}

export function useNetworkOverviewContext() {
  return useContext(NetworkOverviewContext);
}
