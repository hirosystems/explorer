import { Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { TableProps } from '../table/Table';
import { PaginationControl } from './PaginationControls';

interface CursorPaginationProps {
  pageSize: number;
  fetchNextPage: (cursor: string | null) => Promise<{ data: any[]; nextCursor: string | null }>;
}

type TableWithPaginationProps = TableProps & CursorPaginationProps;

export function withCursorPagination<T extends TableProps>(Component: React.ComponentType<T>) {
  return function WrappedComponent({
    rowData,
    pageSize,
    fetchNextPage,
    ...props
  }: TableWithPaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState(rowData.slice(0, pageSize));
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    useEffect(() => {
      setPaginatedData(rowData.slice(0, pageSize));
    }, [rowData, pageSize]);

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
        setPaginatedData(rowData.slice((currentPage - 2) * pageSize, (currentPage - 1) * pageSize));
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <Stack gap={0} alignItems="center" w="full">
        <Component {...(props as T)} rowData={paginatedData} />
        <PaginationControl
          currentPage={currentPage}
          totalPages={Math.ceil(rowData.length / pageSize)}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </Stack>
    );
  };
}
