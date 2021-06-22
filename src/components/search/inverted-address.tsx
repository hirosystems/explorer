import * as React from 'react';
import { Box, color, Flex, Button } from '@stacks/ui';
import { Text } from '@components/typography';
import { border } from '@common/utils';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  searchForAddressOfDifferentType,
  searchValueState,
  searchQueryState,
  searchFocusedState,
} from '@store/recoil/search';
import { useNetworkMode } from '@common/hooks/use-network-mode';

export const InvertedAddressNote: React.FC = () => {
  const networkMode = useNetworkMode();
  const setValue = useSetRecoilState(searchValueState);
  const setQuery = useSetRecoilState(searchQueryState);
  const setFocus = useSetRecoilState(searchFocusedState);
  const invertedAddress = useRecoilValue(searchForAddressOfDifferentType);
  return invertedAddress ? (
    <Box p="base">
      <Flex alignItems="center" justifyContent="space-between" border={border()} p="base">
        <Text fontSize={1} color={color('text-body')} mr="base">
          This is a <strong>{networkMode === 'testnet' ? 'mainnet' : 'testnet'} address</strong>, do
          you want to search for the <strong>{networkMode}</strong> version instead?
        </Text>
        <Button
          as="div"
          size="sm"
          fontSize={1}
          onClick={() => {
            setQuery(invertedAddress);
            setValue(invertedAddress);
            setFocus(true);
          }}
        >
          Search
        </Button>
      </Flex>
    </Box>
  ) : null;
};
