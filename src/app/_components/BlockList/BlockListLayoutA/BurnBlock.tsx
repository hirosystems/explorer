import { css } from '@emotion/react';
import * as React from 'react';
import { ComponentType, ReactNode } from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { GrReturn } from 'react-icons/gr';
import { IoReturnDownBackSharp } from 'react-icons/io5';

import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Circle } from '../../../../ui/Circle';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Icon, IconProps } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

const iconStyle = css`
  height: 18px;
  width: 18px;
  border-radius: 18px;
  position: relative;
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface ListItemProps {
  height: number;
  hash: string;
  timestamp: number;
  txsCount: number;
  icon: ReactNode;
}
export function BurnBlock({ timestamp, height, hash, txsCount, icon }: ListItemProps) {
  return (
    <Box p={'0 35px 0 10px'} backgroundColor={'#F5F5F7'} marginX={'-35px'}>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        flexGrow={1}
        borderBottom={'1px solid #EFEFF2'}
        p={'17px 0'}
      >
        <HStack gap={'6px'}>
          <Icon
            as={BsArrowReturnLeft}
            transform={'rotate(90deg)'}
            size={'11px'}
            color={'#74777D'}
          />
          <Circle size={18} bg="white" css={iconStyle}>
            {icon}
          </Circle>
          <Text fontSize={'14px'} color={'#74777D'}>
            #{height}
          </Text>
        </HStack>
        <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'12px'} color={'#74777D'}>
          <Box>{truncateMiddle(hash)}</Box>
          <Box>{txsCount} txn</Box>
          <Timestamp ts={timestamp} fontWeight={400} fontSize={12} color={'#242629'} />
        </HStack>
      </Flex>
    </Box>
  );
}
