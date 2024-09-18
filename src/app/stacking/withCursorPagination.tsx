import { Stack } from '@/ui/Stack';
import React, { useEffect, useState } from 'react';

import { CustomTableProps } from './CustomTable';
import { PaginationControl } from './PaginationControls';

interface CursorPaginationProps {
  pageSize: number;
  fetchNextPage: (cursor: string | null) => Promise<{ data: any[]; nextCursor: string | null }>;
}

type CustomTableWithPaginationProps = CustomTableProps & CursorPaginationProps;

export function withCursorPagination<T extends CustomTableProps>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent({
    data,
    pageSize,
    fetchNextPage,
    ...props
  }: CustomTableWithPaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState(data.slice(0, pageSize));
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    useEffect(() => {
      setPaginatedData(data.slice(0, pageSize));
    }, [data, pageSize]);

    const handleNextPage = async () => {
      if (nextCursor) {
        const result = await fetchNextPage(nextCursor);
        setPaginatedData(result.data);
        setNextCursor(result.nextCursor);
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setPaginatedData(data.slice((currentPage - 2) * pageSize, (currentPage - 1) * pageSize));
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <Stack gap={0} alignItems="center" w="full">
        <Component {...(props as T)} data={paginatedData} />
        <PaginationControl
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / pageSize)}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </Stack>
    );
  };
}
