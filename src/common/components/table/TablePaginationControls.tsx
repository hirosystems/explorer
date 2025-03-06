import {
  PageChangeDetails,
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@/components/ui/pagination';
import { Text } from '@/ui/Text';
import { Button, Flex, Grid, HStack, Input, Separator } from '@chakra-ui/react';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useState } from 'react';

interface TablePaginationControlsProps {
  pageIndex: number; // the current page index
  pageSize: number; // the current page size, how many rows per page
  pageCount: number; // the total number of pages
  totalRows: number; // the total number of rows
  onPageChange: (page: PaginationState) => void; // the callback to handle page indexchange
  onPageSizeChange?: (page: PaginationState) => void; // the callback to handle page size change
}

export function TablePaginationControls({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  onPageChange,
}: TablePaginationControlsProps) {
  const handlePageChange = useCallback(
    (pageChangeDetails: PageChangeDetails) => {
      onPageChange({ pageIndex: pageChangeDetails.page - 1, pageSize: pageChangeDetails.pageSize }); // Convert from 1-based to 0-based
    },
    [onPageChange]
  );
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Grid
      alignItems="center"
      w="fit-content"
      borderBottomLeftRadius="redesign.lg"
      borderBottomRightRadius="redesign.lg"
      border="1px solid"
      borderTop="none"
      borderColor="redesignBorderSecondary"
      gridTemplateColumns={{ base: '1fr', lg: 'auto 1px auto' }}
      gridTemplateRows={{ base: 'auto auto auto', lg: 'auto' }}
    >
      <Flex alignItems="center" gap={4} px={4} py={2}>
        <PaginationRoot
          page={pageIndex + 1} // the current page index, +1 because the pagination component is 1-based
          pageSize={pageSize} // the current page size, how many rows per page
          count={totalRows} // the total number of rows
          siblingCount={1} // the number of sibling pages to show on either side of the current page
          onPageChange={handlePageChange} // the callback to handle page index change
        >
          <HStack gap={4}>
            <PaginationPrevTrigger px={2} py={1} h="fit-content" />
            <HStack gap={1}>
              <PaginationItems />
            </HStack>
            <PaginationNextTrigger px={2} py={1} h="fit-content" />
          </HStack>
        </PaginationRoot>
      </Flex>

      <Separator
        orientation={{ base: 'horizontal', lg: 'vertical' }}
        h="auto"
        alignSelf="stretch"
        borderColor="redesignBorderSecondary"
        borderWidth="1px"
      />

      <Flex gap={4} px={4} py={2} alignItems="center" justifyContent="center">
        <Flex gap={2} alignItems="center">
          <Input
            variant="redesignPrimary"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            w={12}
            h={6}
            type="number"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handlePageChange({ page: Number(inputValue), pageSize });
                setInputValue('');
              }
            }}
            bg="transparent"
            css={{
              // Hide the spinner buttons
              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              '&[type=number]': {
                '-moz-appearance': 'textfield',
              },
            }}
          />
          <Text fontSize="xs" color="textTertiary">
            of {pageCount > 1000 ? '1000+' : pageCount} pages
          </Text>
        </Flex>
        <Button
          bg="surfacePrimary"
          p={1}
          onClick={() => {
            handlePageChange({ page: Number(inputValue), pageSize });
            setInputValue('');
          }}
          h="fit-content"
          w="fit-content"
          variant="redesignSecondary"
        >
          <Text fontSize="xs" color="var(--stacks-colors-neutral-sand-400)" borderRadius="sm">
            GO
          </Text>
        </Button>
      </Flex>
    </Grid>
  );
}
