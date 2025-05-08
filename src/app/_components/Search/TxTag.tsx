import { Flex, Icon } from '@chakra-ui/react';
import { CheckCircle, Clock, XCircle } from '@phosphor-icons/react';
import * as React from 'react';

import { capitalize } from '../../../common/utils/utils';
import { Text } from '../../../ui/Text';

export function TxTag({ type }: { type: 'confirmed' | 'pending' | 'failed' }) {
  return (
    <Flex
      background={`var(--stacks-colors-transaction-status-${type})`}
      alignItems={'center'}
      gap={1}
      flexWrap={'nowrap'}
      borderRadius={'redesign.md'}
      px={1.5}
      py={0.5}
    >
      {type === 'confirmed' ? (
        <Icon h={3.5} w={3.5} color={'feedback.green-500'}>
          <CheckCircle />
        </Icon>
      ) : type === 'pending' ? (
        <Icon h={3.5} w={3.5} color={'feedback.bronze-600'}>
          <Clock />
        </Icon>
      ) : (
        <Icon h={3.5} w={3.5} color={'feedback.red-600'}>
          <XCircle />
        </Icon>
      )}
      <Text
        color={'textPrimary'}
        fontSize={'xs'}
        fontWeight={'medium'}
        display={{ base: 'none', md: 'block' }}
      >
        {capitalize(type)}
      </Text>
    </Flex>
  );
}
