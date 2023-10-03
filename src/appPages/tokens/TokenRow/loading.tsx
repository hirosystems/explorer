import React, { ReactNode } from 'react';
import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Td } from '@/ui/Td';
import { Tr } from '@/ui/Tr';

export function Loading(props: { children?: ReactNode }) {
  return (
    <Tr>
      <Td padding="10px 20px 10px 16px" width={['auto', 'auto', '30%']}>
        <Flex alignItems="center" gap="8px">
          <ExplorerSkeletonLoader width="36px" height="36px" />
          <Box width="100%" maxWidth="120px">
            <ExplorerSkeletonLoader height="15px" />
          </Box>
        </Flex>
      </Td>
      <Td padding="10px" display={['none', 'none', 'table-cell']}>
        <Box maxWidth="500px">
          <ExplorerSkeletonLoader height="15px" />
        </Box>
      </Td>
      <Td isNumeric width="130px" padding="10px 16px 10px 20px">
        <Box maxWidth="70px" marginLeft="auto">
          <ExplorerSkeletonLoader height="15px" />
        </Box>
      </Td>
    </Tr>
  );
}
