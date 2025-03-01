import { Box, Flex, FlexProps, Stack } from '@chakra-ui/react';
import { PaginationState } from '@tanstack/react-table';

import { Card } from '../Card';
import {
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@/components/ui/pagination';

interface TableContainerProps extends FlexProps {
  pagination?: PaginationState;
}

const TablePaginationContainer = ({ pagination }: { pagination: PaginationState }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="fit-content"
      px={4}
      py={2}
      borderBottomLeftRadius="md"
      borderBottomRightRadius="md"
      border="1px solid"
      borderTop="none"
      borderColor="redesignBorderSecondary"
    >
      <PaginationRoot>
        <PaginationPrevTrigger />
        <PaginationItem />
        <PaginationNextTrigger />
      </PaginationRoot>
    </Flex>
  );
};

export function TableContainer({ children, pagination, ...rest }: TableContainerProps) {
  return (
    <Stack gap={0} alignItems="center">
      <Card
        h="fit-content"
        w="full"
        p={[3, 3, 3, 4]}
        borderColor="redesignBorderSecondary"
        className="table-container-card"
        {...rest}
      >
        <Box
          overflowX="auto"
          overflowY="hidden"
          h="full"
          w="full"
          className="table-scroll-container"
        >
          {children}
        </Box>
      </Card>
      {pagination && <TablePaginationContainer pagination={pagination} />}
    </Stack>
  );
}
