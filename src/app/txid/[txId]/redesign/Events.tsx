import { Stack } from '@chakra-ui/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { EventsTableFilters } from './events-table/EventsTableFilters';
import { EventsTableWithFilters } from './events-table/EventsTableWithFilters';
import { EventsTableFiltersProvider } from './events-table/filters/useEventsTableFilters';

export function Events({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <EventsTableFiltersProvider>
      <Stack>
        <EventsTableFilters />
        <EventsTableWithFilters txId={tx.tx_id} initialData={undefined} />
      </Stack>
    </EventsTableFiltersProvider>
  );
}
