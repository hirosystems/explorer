'use client';

import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { PiFlask } from 'react-icons/pi';

import { Badge } from '../../../common/components/Badge';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { capitalize } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';

export const NetworkModeBanner: FC = () => {
  const networkMode = useGlobalContext().activeNetwork.mode;
  const colorMode = useColorMode().colorMode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'}>
      <Flex alignItems="center" as={'span'}>
        <Icon as={PiFlask} color={'black'} size={4} />
        <Text color={'black'} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)}
        </Text>
      </Flex>
    </Badge>
  );
};
