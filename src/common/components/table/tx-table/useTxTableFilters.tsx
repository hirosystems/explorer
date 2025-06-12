import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import {
  useAddressFilterHandler,
  useClearAddressFilterHandler,
  useClearDateFilterHandler,
  useClearTransactionTypeFilterHandler,
  useDateFilterHandler,
  useTransactionTypeFilterHandler,
} from '../filters/table-filters-utils';
import { useClearAllTxTableFiltersHandler } from './tx-table-filters-utils';

export interface TxTableFilters {
  transactionType: string[];
  fromAddress: string;
  toAddress: string;
  startTime: string;
  endTime: string;
}

type TxTableFilterKeys = keyof TxTableFilters;
export const TX_TABLE_FILTER_KEYS: Array<TxTableFilterKeys> = [
  'transactionType',
  'fromAddress',
  'toAddress',
  'startTime',
  'endTime',
];

export const TxTableFiltersContext = createContext<
  TxTableFilters & {
    addressFilterHandler: (fromAddress: string, toAddress: string) => void;
    dateFilterHandler: (startTime?: number, endTime?: number) => void;
    transactionTypeFilterHandler: (transactionType: string[]) => void;
    clearFiltersHandler: () => void;
    clearAddressFilterHandler: () => void;
    clearDateFilterHandler: () => void;
    clearTransactionTypeFilterHandler: () => void;
  }
>({
  transactionType: [],
  fromAddress: '',
  toAddress: '',
  startTime: '',
  endTime: '',
  addressFilterHandler: (fromAddress: string, toAddress: string) => {},
  dateFilterHandler: (startTime?: number, endTime?: number) => {},
  transactionTypeFilterHandler: (transactionType: string[]) => {},
  clearFiltersHandler: () => {},
  clearAddressFilterHandler: () => {},
  clearDateFilterHandler: () => {},
  clearTransactionTypeFilterHandler: () => {},
});

export const TxTableFiltersProvider = ({
  defaultTransactionType = [],
  defaultFromAddress = '',
  defaultToAddress = '',
  defaultStartTime = '',
  defaultEndTime = '',
  children,
}: {
  defaultTransactionType?: string[];
  defaultFromAddress?: string;
  defaultToAddress?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  children: React.ReactNode;
}) => {
  // Set filters to default values passed down from the server
  const [transactionType, setTransactionType] = useState<string[]>(defaultTransactionType);
  const [fromAddress, setFromAddress] = useState<string>(defaultFromAddress);
  const [toAddress, setToAddress] = useState<string>(defaultToAddress);
  const [startTime, setStartTime] = useState<string>(defaultStartTime);
  const [endTime, setEndTime] = useState<string>(defaultEndTime);

  // Sync filters with search params
  const searchParams = useSearchParams();
  useEffect(() => {
    TX_TABLE_FILTER_KEYS.forEach((filter: TxTableFilterKeys) => {
      if (searchParams.has(filter)) {
        const value = searchParams.get(filter);
        if (value) {
          if (filter === 'transactionType') {
            setTransactionType(value.split(','));
          } else if (filter === 'startTime') {
            setStartTime(value);
          } else if (filter === 'endTime') {
            setEndTime(value);
          } else if (filter === 'fromAddress') {
            setFromAddress(value);
          } else if (filter === 'toAddress') {
            setToAddress(value);
          }
        }
      } else {
        if (filter === 'transactionType') {
          setTransactionType([]);
        } else if (filter === 'startTime') {
          setStartTime('');
        } else if (filter === 'endTime') {
          setEndTime('');
        } else if (filter === 'fromAddress') {
          setFromAddress('');
        } else if (filter === 'toAddress') {
          setToAddress('');
        }
      }
    });
  }, [searchParams]);

  const addressFilterHandler = useAddressFilterHandler();
  const dateFilterHandler = useDateFilterHandler();
  const transactionTypeFilterHandler = useTransactionTypeFilterHandler();
  const clearAddressFilterHandler = useClearAddressFilterHandler();
  const clearDateFilterHandler = useClearDateFilterHandler();
  const clearTransactionTypeFilterHandler = useClearTransactionTypeFilterHandler();
  const clearFiltersHandler = useClearAllTxTableFiltersHandler();

  return (
    <TxTableFiltersContext.Provider
      value={{
        transactionType,
        fromAddress,
        toAddress,
        startTime,
        endTime,
        addressFilterHandler,
        dateFilterHandler,
        transactionTypeFilterHandler,
        clearFiltersHandler,
        clearAddressFilterHandler,
        clearDateFilterHandler,
        clearTransactionTypeFilterHandler,
      }}
    >
      {children}
    </TxTableFiltersContext.Provider>
  );
};

export const useTxTableFilters = () => {
  return useContext(TxTableFiltersContext);
};
