'use client';

import { Flask } from '@phosphor-icons/react';
import { FC } from 'react';

import { Badge } from '../../../common/components/Badge';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { capitalize } from '../../../common/utils/utils';
import { BadgeProps } from '../../../ui/Badge';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';

export function NetworkModeBanner(props: FlexProps) {
  const networkMode = useGlobalContext().activeNetwork.mode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'} {...props}>
      <Flex alignItems="center" as={'span'}>
        <Icon as={Flask} color={'black'} size={4} />
        <Text color={'black'} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)}
        </Text>
      </Flex>
    </Badge>
  );
}
