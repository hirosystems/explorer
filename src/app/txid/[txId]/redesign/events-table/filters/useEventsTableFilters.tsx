import {
  addressFilterMutator,
  eventAssetTypeFilterMutator,
  singleAddressFilterMutator,
  useQueryUpdater,
} from '@/common/components/table/filters/table-filters-utils';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { TransactionEventType } from '@stacks/stacks-blockchain-api-types';

export interface EventsTableFilters {
  eventAssetTypes: TransactionEventType[];
  address: string;
}

type EventsTableFilterKeys = keyof EventsTableFilters;
export const EVENTS_TABLE_FILTER_KEYS: Array<EventsTableFilterKeys> = [
  'eventAssetTypes',
  'address',
];

export const EventsTableFiltersContext = createContext<
  EventsTableFilters & {
    addressFilterHandler: (address?: string) => void;
    eventAssetTypeFilterHandler: (eventAssetTypes?: TransactionEventType[]) => void;
    clearAllFiltersHandler: () => void;
  }
>({
  eventAssetTypes: [],
  address: '',
  addressFilterHandler: (address?: string) => {},
  eventAssetTypeFilterHandler: (eventAssetTypes?: TransactionEventType[]) => {},
  clearAllFiltersHandler: () => {},
});

// TODO: we can probably abstract this out to a generic filter provider
export const EventsTableFiltersProvider = ({
  defaultEventAssetTypes = [],
  defaultAddress = '',
  children,
}: {
  defaultEventAssetTypes?: TransactionEventType[];
  defaultAddress?: string;
  children: React.ReactNode;
}) => {
  // Set filters to default values passed down from the server
  const [eventAssetTypes, setEventAssetTypes] =
    useState<TransactionEventType[]>(defaultEventAssetTypes);
  const [address, setAddress] = useState<string>(defaultAddress);

  // Sync filters with search params
  const searchParams = useSearchParams();
  useEffect(() => {
    EVENTS_TABLE_FILTER_KEYS.forEach((filter: EventsTableFilterKeys) => {
      if (searchParams.has(filter)) {
        const value = searchParams.get(filter);
        if (value) {
          if (filter === 'eventAssetTypes') {
            setEventAssetTypes(value.split(',') as TransactionEventType[]);
          } else if (filter === 'address') {
            setAddress(value);
          }
        }
      } else {
        if (filter === 'eventAssetTypes') {
          setEventAssetTypes([]);
        } else if (filter === 'address') {
          setAddress('');
        }
      }
    });
  }, [searchParams]);

  const addressFilterHandler = useQueryUpdater(singleAddressFilterMutator);
  const eventAssetTypeFilterHandler = useQueryUpdater(eventAssetTypeFilterMutator);
  const clearAllFiltersHandler = useQueryUpdater((params: URLSearchParams) => {
    addressFilterMutator(params, undefined, undefined);
    eventAssetTypeFilterMutator(params, undefined);
    return params;
  });

  console.log('EventsTableFiltersProvider', { eventAssetTypes, address });

  return (
    <EventsTableFiltersContext.Provider
      value={{
        eventAssetTypes,
        address,
        addressFilterHandler,
        eventAssetTypeFilterHandler,
        clearAllFiltersHandler,
      }}
    >
      {children}
    </EventsTableFiltersContext.Provider>
  );
};

export const useEventsTableFilters = () => {
  return useContext(EventsTableFiltersContext);
};
