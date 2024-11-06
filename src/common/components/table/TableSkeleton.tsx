import { SkeletonItem } from '@/ui/SkeletonItem';
import { useMemo } from 'react';

import { ColumnDefinition, Table } from './Table';

function getDefaultSkeletonColumnDefinition<T extends unknown[]>(
  id: string,
  header?: React.ReactNode,
  cellRenderer?: (value: string) => React.ReactNode
): ColumnDefinition<T, string> {
  return {
    id,
    header: header ?? <SkeletonItem height="20px" width="20px" />,
    accessor: val => '',
    cellRenderer: cellRenderer ?? ((val: string) => <SkeletonItem height="20px" width="20px" />),
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
        getDefaultSkeletonColumnDefinition<unknown[]>(i.toString())
      ),
    [numColumns]
  );

  return <Table rowData={rowData} columnDefinitions={columnDefinitions} />;
}
