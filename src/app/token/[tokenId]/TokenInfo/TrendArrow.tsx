import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FC } from 'react';

import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';

export const TrendArrow: FC<{ change: number; size: string | number }> = ({ change, size }) => {
  return (
    <Flex alignItems={'center'}>
      {change >= 0 ? (
        <Icon as={CaretUp} size={size} fill={`success`} color={`success`} />
      ) : (
        <Icon as={CaretDown} size={size} fill={`error`} color={`error`} />
      )}
      &nbsp;
      <Text color={change >= 0 ? `success` : `error`}>{Math.round(change * 10) / 10}%</Text>
    </Flex>
  );
};
