import { useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { ReactNode, memo } from 'react';

import { Circle } from '../../../../common/components/Circle';
import { BlockLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Text } from '../../../../ui/Text';

interface ListItemProps {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  icon?: ReactNode;
}

export const StxBlock = memo(function ({ timestamp, height, hash, txsCount, icon }: ListItemProps) {
  const textColor = useColorModeValue('slate.900', 'slate.50');
  const secondaryTextColor = useColorModeValue('slate.700', 'slate.600');
  const borderColor = useColorModeValue('slate.300', 'slate.800');
  return (
    <Box
      pl={4}
      borderLeft={icon ? undefined : '1px'}
      borderColor={borderColor}
      position="relative"
      __css={{
        '>div': {
          borderTop: '1px',
        },
        '&:first-child >div': {
          borderTop: 'none',
        },
      }}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        flexGrow={1}
        height={14}
        _after={
          icon
            ? {
                content: '""',
                position: 'absolute',
                left: '0',
                bottom: '0',
                height: '10px',
                width: '1px',
                backgroundColor: borderColor,
              }
            : {
                content: '""',
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: borderColor,
                borderRadius: '50%',
              }
        }
      >
        <Flex>
          {!!icon && (
            <Circle size={4.5} bg="brand" ml={-6} mr={2} border={'none'}>
              {icon}
            </Circle>
          )}

          <BlockLink hash={hash}>
            <Text fontSize={'14px'} color={textColor} fontWeight={'medium'}>
              #{height}
            </Text>
          </BlockLink>
        </Flex>
        <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'12px'} color={secondaryTextColor}>
          <Box>{truncateMiddle(hash, 3)}</Box>
          {txsCount !== undefined ? <Box>{txsCount} txn</Box> : null}
          <Timestamp ts={timestamp} />
        </HStack>
      </Flex>
    </Box>
  );
});
