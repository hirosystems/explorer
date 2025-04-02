import { Stack } from '@chakra-ui/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TabsContentContainer } from './TxTabs';
import { EventsTableFilters } from './events-table/EventsTableFilters';
import { EventsTableWithFilters } from './events-table/EventsTableWithFilters';
import { EventsTableFiltersProvider } from './events-table/filters/useEventsTableFilters';

export function Events({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <EventsTableFiltersProvider>
      <Stack>
        <EventsTableFilters />
        <TabsContentContainer>
          <EventsTableWithFilters txId={tx.tx_id} initialData={undefined} />
        </TabsContentContainer>
      </Stack>
    </EventsTableFiltersProvider>
  );
}
