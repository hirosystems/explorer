import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Stack } from '@chakra-ui/react';
import { EventsTable } from './events-table/EventsTable';
import { EventsTableFilters } from './events-table/EventsTableFilters';

export function Events({ tx }: { tx: Transaction | MempoolTransaction }) {
  return (
    <Stack>
      <EventsTableFilters />
      <EventsTable txId={tx.tx_id} initialData={undefined} />
    </Stack>
  );
}
