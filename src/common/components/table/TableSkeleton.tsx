import { Skeleton } from '@/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { Table } from './Table';

function getDefaultSkeletonColumnDefinition(id: string): ColumnDef<unknown> {
  return {
    id,
    header: () => <Skeleton height={5} width={25} />,
    cell: () => <Skeleton height={5} width={25} />,
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

  return <Table data={rowData} columns={columnDefinitions} />;
}
