import { MagnifyingGlass, X } from '@phosphor-icons/react';
import * as React from 'react';

import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';

export function NoTxs() {
  return (
    <Flex
      direction={'column'}
      alignItems={'center'}
      maxWidth={'437px'}
      margin={'auto'}
      textAlign={'center'}
      py={10}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width={'72px'}
        height={'72px'}
        border={'1px'}
        rounded={'full'}
        mb={3}
      >
        <Flex
          border={'1px'}
          borderColor={'transparent'}
          width={'18px'}
          height={'18px'}
          position={'relative'}
          alignItems="center"
          justifyContent="center"
          left={'-2px'}
        >
          <Icon
            as={MagnifyingGlass}
            size={6}
            color="textSubdued"
            position={'absolute'}
            top={'-2px'}
            left={'-2px'}
          />
          <Icon as={X} size={2.5} color="textSubdued" margin={'auto'} />
        </Flex>
      </Flex>
      <Text fontSize={'md'} color={'text'} mb={2} fontWeight={'medium'} lineHeight={'1.5em'}>
        No results found
      </Text>
      <Text fontSize={'sm'} color={'textSubdued'} lineHeight={'1.42em'}>
        Please use a valid transaction ID, block hash, block height, address, token name, contract
        name, BNS name, or date. Only these inputs are supported for now, but we are working on
        adding more search capabilities.
      </Text>
    </Flex>
  );
}
