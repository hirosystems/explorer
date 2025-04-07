import { Timeframe } from '@/common/components/TimeframeSelector';
import { createContext, useContext, useState } from 'react';

export enum Chart {
  dailyTransactions = 'Transactions',
  blocksMined = 'Blocks mined',
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
