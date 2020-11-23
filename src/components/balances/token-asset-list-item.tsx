import * as React from 'react';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { Box, color, Flex, FlexProps, space } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { TxLink } from '@components/links';
import { DynamicColorCircle } from '@components/dynamic-color-circle';
import { getAssetNameParts } from '@common/utils';

interface TokenAssetListItemProps extends FlexProps {
  token: string;
  isLast: boolean;
  balances: AddressBalanceResponse;
  type: 'non_fungible_tokens' | 'fungible_tokens';
}

export const TokenAssetListItem: React.FC<TokenAssetListItemProps> = ({
  token,
  balances,
  type,
  isLast,
}) => {
  const { address, asset, contract } = getAssetNameParts(token);
  const key = type === 'non_fungible_tokens' ? 'count' : 'balance';
  return (
    <Flex
      justifyContent="space-between"
      // borderBottom={!isLast ? border() : 'unset'}
      px="base"
      py="tight"
    >
      <Box>
        <Flex alignItems="center" mb={space('extra-tight')}>
          <DynamicColorCircle size="32px" string={`${address}.${contract}::${asset}`}>
            {asset[0]}
          </DynamicColorCircle>
          <Box>
            <Text color={color('text-title')} mb="extra-tight" fontWeight="600">
              {asset}
            </Text>
            <TxLink txid={`${address}.${contract}`}>
              <Caption
                target="_blank"
                _hover={{
                  textDecoration: 'underline',
                }}
                as="a"
              >
                {contract}
              </Caption>
            </TxLink>
          </Box>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" textAlign="right">
        <Text color={color('text-body')} textAlign="right">
          {key === 'balance'
            ? parseFloat((balances as any)[type][token][key]).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })
            : parseInt((balances as any)[type][token][key]).toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
};
