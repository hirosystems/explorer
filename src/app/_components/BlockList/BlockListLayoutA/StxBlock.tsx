import { css } from '@emotion/react';
import * as React from 'react';
import { ComponentType, ReactNode } from 'react';

import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Circle } from '../../../../ui/Circle';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { IconProps } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

const iconStyle = css`
  height: 18px;
  width: 18px;
  border-radius: 18px;
  position: absolute;
  left: -9px;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
`;

interface ListItemProps {
  height: number;
  hash: string;
  timestamp: number;
  txsCount: number;
  icon?: ReactNode;
}
export function StxBlock({ timestamp, height, hash, txsCount, icon }: ListItemProps) {
  return (
    <Box pl={'17px'} borderLeft={icon ? undefined : '1px solid #DCDDE2'} position="relative">
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        flexGrow={1}
        borderBottom={'1px solid #EFEFF2'}
        p={'17px 0'}
        _after={
          icon
            ? {
                content: '""',
                position: 'absolute',
                left: '0',
                bottom: '0',
                height: '10px',
                width: '1px',
                backgroundColor: '#DCDDE2',
              }
            : {
                content: '""',
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: '#DCDDE2',
                borderRadius: '50%',
              }
        }
      >
        <Flex>
          {!!icon && (
            <Circle size={18} bg="accent.light" css={iconStyle}>
              {icon}
            </Circle>
          )}
          <Text fontSize={'14px'} color={'#242629'}>
            #{height}
          </Text>
        </Flex>
        <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'12px'} color={'#74777D'}>
          <Box>{truncateMiddle(hash)}</Box>
          <Box>{txsCount} txn</Box>
          <Timestamp ts={timestamp} fontWeight={400} fontSize={12} color={'#242629'} />
        </HStack>
      </Flex>
    </Box>
  );
}
