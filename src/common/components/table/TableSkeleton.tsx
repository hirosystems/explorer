import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

import { ColumnDefinition, Table } from './Table';

function getDefaultSkeletonColumnDefinition(id: string): ColumnDefinition<any, string> {
  return {
    id,
    header: <Skeleton height={5} width={25} />,
    accessor: () => '',
    cellRenderer: () => <Skeleton height={5} width={25} />,
  };
}

export function TableSkeleton({
  numColumns = 5,
  numRows = 10,
}: {
  numColumns?: number;
  numRows?: number;
}) {
  const rowData = useMemo(
    () => Array(numRows).fill(Array(numColumns).fill(null)),
    [numRows, numColumns]
  );
  const columnDefinitions = useMemo(
    () =>
      Array.from({ length: numColumns }).map((_, i) =>
        getDefaultSkeletonColumnDefinition(i.toString())
      ),
    [numColumns]
  );

  return <Table rowData={rowData} columnDefinitions={columnDefinitions} />;
}
