import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import React from 'react';

export function SSRSkeletonTxList() {
  return (
    <Box position={'relative'} px={'20px'}>
      {[...Array(10)].map((_, i) => (
        <Flex flexGrow={1} gap={'16px'} alignItems={'center'} py={'24px'} minWidth={0}>
          <Box width={'40px'}>
            <ExplorerSkeletonLoader width={'40px'} height={'40px'} circle={true} />
          </Box>
          <Flex direction={'column'} gap={'6px'} minWidth={0}>
            <Flex direction={'column'} minHeight={'24px'} justifyContent={'center'} mb={'8px'}>
              <ExplorerSkeletonLoader width={'192px'} height={'15px'} />
            </Flex>
            <Box>
              <ExplorerSkeletonLoader width={'180px'} height={'12px'} />
            </Box>
          </Flex>
          <Flex direction={'column'} gap={'8px'} ml={'auto'} flexShrink={0}>
            <Box alignSelf={'flex-end'}>
              <ExplorerSkeletonLoader width={'89px'} height={'14px'} />
            </Box>
            <Box alignSelf={'flex-end'}>
              <ExplorerSkeletonLoader width={'72px'} height={'12px'} />
            </Box>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
}
