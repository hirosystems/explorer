import { TxPageFilters } from '@/app/transactions/page';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { createContext, useContext, useState } from 'react';

interface TxTableFilterState {
  addresses: {
    fromAddress: string | undefined;
    toAddress: string | undefined;
  };
  dates: {
    startTime: string | undefined;
    endTime: string | undefined;
  };
  transactionTypes: string[];
}

interface TxTableFilterContextType {
  filters: TxTableFilterState;
  updateAddressFilters: (addresses: {
    fromAddress: string | undefined;
    toAddress: string | undefined;
  }) => void;
  updateDateFilters: (dates: {
    startTime: string | undefined;
    endTime: string | undefined;
  }) => void;
  updateTransactionTypes: (types: string[]) => void;
  resetFilters: () => void;
}

const TxTableFilterContext = createContext<TxTableFilterContextType | undefined>(undefined);

export function TxTableFilterProvider({
  filters: filterProps,
  children,
}: {
  filters: TxPageFilters;
  children: React.ReactNode;
}) {
  const { activeFilters } = useFilterAndSortState();

  const [filters, setFilters] = useState<TxTableFilterState>({
    addresses: { fromAddress: filterProps.fromAddress, toAddress: filterProps.toAddress },
    dates: { startTime: filterProps.startTime, endTime: filterProps.endTime },
    transactionTypes: activeFilters,
  });

  const updateAddressFilters = (addresses: {
    fromAddress: string | undefined;
    toAddress: string | undefined;
  }) => {
    setFilters(prev => ({ ...prev, addresses }));
  };

  const updateDateFilters = (dates: {
    startTime: string | undefined;
    endTime: string | undefined;
  }) => {
    setFilters(prev => ({ ...prev, dates }));
  };

  const updateTransactionTypes = (types: string[]) => {
    setFilters(prev => ({ ...prev, transactionTypes: types }));
  };

  const resetFilters = () => {
    setFilters({
      addresses: { fromAddress: undefined, toAddress: undefined },
      dates: { startTime: undefined, endTime: undefined },
      transactionTypes: [],
    });
  };

  return (
    <TxTableFilterContext.Provider
      value={{
        filters,
        updateAddressFilters,
        updateDateFilters,
        updateTransactionTypes,
        resetFilters,
      }}
    >
      {children}
    </TxTableFilterContext.Provider>
  );
}

export const useTxTableFilters = () => {
  const context = useContext(TxTableFilterContext);
  if (!context) return undefined;
  return context;
};
