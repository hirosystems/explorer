import { Flex, Icon } from '@chakra-ui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FC } from 'react';

import { Text } from '../../../../ui/Text';

export const TrendArrow: FC<{ change: number; size: string }> = ({ change, size }) => {
  return (
    <Flex alignItems={'center'}>
      {change >= 0 ? (
        <Icon h={size} w={size} fill={'success'} color={'success'}>
          <CaretUp />
        </Icon>
      ) : (
        <Icon h={size} w={size} fill={'error'} color={'error'}>
          <CaretDown />
        </Icon>
      )}
      &nbsp;
      <Text color={change >= 0 ? 'success' : 'error'}>{Math.round(change * 10) / 10}%</Text>
    </Flex>
  );
};
