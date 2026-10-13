import { EVENTS_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { TxDetails } from '@/common/types/tx-v3';

import { EventsTable } from './events-table/EventsTable';

export function Events({ tx }: { tx: TxDetails }) {
  return <EventsTable txId={tx.tx_id} initialData={undefined} pageSize={EVENTS_TABLE_PAGE_SIZE} />;
}
