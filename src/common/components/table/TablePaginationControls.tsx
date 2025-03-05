import React from 'react';
import { 
  PaginationRoot, 
  PaginationItem, 
  PaginationPrevTrigger, 
  PaginationNextTrigger,
  PaginationPageText,
  PaginationItems
} from '@/components/ui/pagination';
import { Flex, HStack, Text } from '@chakra-ui/react';
import { Select } from '@/components/ui/select';

interface TablePaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  variant?: 'outline' | 'solid' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export function TablePaginationControls({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  onPageChange,
  onPageSizeChange,
  variant = 'outline',
  size = 'sm',
}: TablePaginationControlsProps) {
  const handlePageChange = React.useCallback(
    (page: number) => {
      onPageChange(page - 1); // Convert from 1-based to 0-based
    },
    [onPageChange]
  );

  const handlePageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange?.(Number(e.target.value));
    },
    [onPageSizeChange]
  );

  return (
    <Flex justifyContent="space-between" alignItems="center" w="full" py={4} px={2}>
      <Flex alignItems="center" gap={2}>
        <Text fontSize="sm" fontWeight="medium">Rows per page:</Text>
        {onPageSizeChange && (
          <Select 
            size={size} 
            value={pageSize} 
            onChange={handlePageSizeChange}
            width="80px"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        )}
      </Flex>
      
      <Flex alignItems="center" gap={4}>
        <Text fontSize="sm" fontWeight="medium">
          {`${pageIndex * pageSize + 1}-${Math.min((pageIndex + 1) * pageSize, totalRows)} of ${totalRows}`}
        </Text>
        
        <PaginationRoot 
          page={pageIndex + 1} 
          count={pageCount} 
          onChange={handlePageChange}
          variant={variant}
          size={size}
        >
          <HStack spacing={2}>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Flex>
    </Flex>
  );
}