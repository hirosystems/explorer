import { useVerticallyStackedElementsBorderStyle } from '@/app/common/styles/border';
import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { SkeletonTxListItemMini } from '@/components/loaders/skeleton-transaction';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Stack } from '@/ui/Stack';
import { useColorMode } from '@chakra-ui/react';
import React, { FC } from 'react';

export const SkeletonRightPanel: FC = () => {
  return (
    <Flex flexGrow={1} flexDirection="column" borderLeftWidth={'1px'}>
      <Box bg={'bg'} borderBottomWidth="1px" p="24px">
        <Stack spacing="16px">
          <Stack textAlign="right" alignItems={'flex-end'}>
            <ExplorerSkeletonLoader width={'90px'} height={'12px'} />
            <Flex
              flexShrink={0}
              flexGrow={1}
              alignItems="center"
              position="relative"
              justifyContent="flex-end"
              gap={'8px'}
            >
              <ExplorerSkeletonLoader width={'18px'} height={'18px'} />
              <ExplorerSkeletonLoader width={'185px'} height={'24px'} />
            </Flex>
          </Stack>
          <Flex textAlign="right" justifyContent="flex-end" alignItems="center">
            <ExplorerSkeletonLoader width={'185px'} height={'12px'} />
            <Box position="relative" ml="8px">
              <ExplorerSkeletonLoader width={'14px'} height={'14px'} />
            </Box>
          </Flex>
        </Stack>
      </Box>
      <Flex
        position="relative"
        flexDirection="column"
        flexGrow={1}
        bg={`bgAlt.${useColorMode().colorMode}`}
        borderBottomRightRadius="12px"
        overflow="hidden"
      >
        <Flex px="16px" borderBottomWidth="1px" py="8px" bg={`bg.${useColorMode().colorMode}`}>
          <ExplorerSkeletonLoader width={'90px'} height={'12px'} />
        </Flex>
        <Flex
          flexDirection="column"
          flexGrow={1}
          overflow="auto"
          bg={`bg.${useColorMode().colorMode}`}
          position="relative"
          pl={'20px'}
          css={useVerticallyStackedElementsBorderStyle}
        >
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
          <SkeletonTxListItemMini />
        </Flex>
      </Flex>
    </Flex>
  );
};
