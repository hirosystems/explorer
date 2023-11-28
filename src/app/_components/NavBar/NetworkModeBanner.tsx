'use client';

import { useColorMode } from '@chakra-ui/react';
import { FC } from 'react';

import { Badge } from '../../../common/components/Badge';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { capitalize } from '../../../common/utils/utils';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text } from '../../../ui/Text';
import { FlaskIcon } from '../../../ui/icons';

export const NetworkModeBanner: FC = () => {
  const networkMode = useGlobalContext().activeNetwork.mode;
  const colorMode = useColorMode().colorMode;
  if (networkMode !== 'testnet') return null;
  return (
    <Badge bg="white" border={'none'}>
      <Flex alignItems="center" as={'span'}>
        <Icon as={FlaskIcon} color={`brand.${colorMode}`} size="16px" mr="4px" />
        <Text color={`textTitle.light`} whiteSpace={'nowrap'} as={'span'}>
          {capitalize(networkMode)} mode
        </Text>
      </Flex>
    </Badge>
  );
};
