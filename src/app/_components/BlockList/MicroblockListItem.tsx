import React from 'react';
import { FiZap } from 'react-icons/fi';

import { Circle } from '../../../common/components/Circle';
import { MicroBlockLink } from '../../../common/components/ExplorerLinks';
import { toRelativeTime } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Caption, Text, Title } from '../../../ui/typography';

export const MicroblockListItem: React.FC<{
  blockTime: number;
  hash: string;
  index: number;
}> = ({ blockTime, hash, index, ...rest }) => {
  return (
    <Flex
      justifyContent="space-between"
      py="24px"
      _hover={{
        borderLeftColor: 'accent',
      }}
      {...rest}
    >
      <HStack as="span" alignItems="center" gap={4} minWidth={0}>
        <Circle size="40px" flexShrink={0}>
          <Icon as={FiZap} size="16px" fill={'textCaption.light'} color={'textCaption.light'} />
        </Circle>
        <Stack gap={2} as="span" minWidth={0}>
          <Flex alignItems="center" minWidth={0}>
            <MicroBlockLink hash={hash}>
              <Title
                display="block"
                fontSize={'sm'}
                minWidth={0}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                whiteSpace={'nowrap'}
              >
                {hash}
              </Title>
            </MicroBlockLink>
          </Flex>
          <Caption display="block">Microblock</Caption>
        </Stack>
      </HStack>
      <Stack gap={2} textAlign="right" as="span" minWidth={'80px'}>
        <Text
          fontSize="14px"
          width="100%"
          textAlign="right"
          display="block"
          suppressHydrationWarning={true}
        >
          {toRelativeTime(blockTime * 1000)}
        </Text>
      </Stack>
    </Flex>
  );
};
