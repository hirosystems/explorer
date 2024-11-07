'use client';

import { Flex, Icon } from '@chakra-ui/react';
import { Flask } from '@phosphor-icons/react';
import { FC } from 'react';

import { Badge } from '../../../common/components/Badge';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { capitalize } from '../../../common/utils/utils';
import { Text } from '../../../ui/Text';

export const NetworkModeBanner: FC = () => {
  const networkMode = useGlobalContext().activeNetwork.mode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'}>
      <Flex alignItems="center" as={'span'}>
        <Icon color={'black'} h={4} w={4}>
          <Flask />
        </Icon>
        <Text color={'black'} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)}
        </Text>
      </Flex>
    </Badge>
  );
};
