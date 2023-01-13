import { SECTION_HEADER_HEIGHT } from '@/common/constants/sizes';
import { ExplorerSkeletonLoader } from '@/components/loaders/skeleton-common';
import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Text, Title } from '@/ui/typography';
import React from 'react';

function SSRSkeletonBlockList() {
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

export default function Loading() {
  return (
    <>
      <Box mb="24px">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Blocks
        </Title>
      </Box>
      <Flex
        direction={'column'}
        mb="32px"
        gap={'24px'}
        bg={'bg.light'}
        borderRadius={'12px'}
        borderWidth={'1px'}
      >
        <Flex
          alignItems="center"
          bg={'bg'}
          justifyContent="space-between"
          borderBottomWidth="1px"
          flexShrink={0}
          p="12px 16px"
          borderTopRightRadius="12px"
          borderTopLeftRadius="12px"
          minHeight={SECTION_HEADER_HEIGHT}
        >
          <Text color={'textTitle'} fontWeight="500" py={'10px'}>
            Recent Blocks
          </Text>
        </Flex>
        <Flex flexDirection="column" flexGrow={1}>
          <Flex flexDirection="column" flexGrow={1} px="20px">
            <SSRSkeletonBlockList />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
