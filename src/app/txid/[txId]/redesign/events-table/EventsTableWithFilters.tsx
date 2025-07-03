import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';

import { EventsTable, EventsTableData } from './EventsTable';
import { useEventsTableFilters } from './filters/useEventsTableFilters';

export function EventsTableWithFilters({
  txId,
  initialData,
}: {
  txId: string;
  initialData: GenericResponseType<EventsTableData> | undefined;
}) {
  const { address, eventAssetTypes } = useEventsTableFilters();
  return (
    <EventsTable txId={txId} initialData={initialData} filters={{ address, eventAssetTypes }} />
  );
}
