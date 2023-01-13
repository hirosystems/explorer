'use client';

import { useContractFtMetadata } from '@/app/common/queries/useContractFtMetadata';
import { useApi } from '@/common/api/client';
import { ftDecimals, getAssetNameParts, initBigNumber } from '@/common/utils';
import { TxLink } from '@/components/links';
import { getTicker } from '@/components/tx-events';
import { Box, Flex, FlexProps, Stack } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';
import React from 'react';

import { TokenAvatar } from '../token-avatar';

interface TokenAssetListItemProps extends FlexProps {
  amount: string;
  token: string;
  tokenType: 'non_fungible_tokens' | 'fungible_tokens';
  bnsName?: string;
}
export const TokenAssetListItem: React.FC<TokenAssetListItemProps> = ({
  amount,
  token,
  tokenType,
  bnsName,
}) => {
  const api = useApi();
  const { address, asset, contract } = getAssetNameParts(token);
  const contractId = `${address}.${contract}`;

  const { data: ftMetadata } = useContractFtMetadata(api, { contractId });

  const totalType = tokenType === 'non_fungible_tokens' ? 'count' : 'balance';

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;

  return (
    <Flex justifyContent="space-between" px="16px" py="16px">
      <Box>
        <Flex alignItems="center" mb={'4px'}>
          <TokenAvatar token={token} tokenMetadata={ftMetadata} />
          <Stack spacing="4px">
            <Text color={'textTitle'} fontWeight="600">
              {bnsName || asset}
            </Text>
            <Stack isInline spacing="4px" divider={<Caption>∙</Caption>} wrap="wrap">
              <Caption>{ftMetadata?.symbol || getTicker(asset).toUpperCase()}</Caption>
              <TxLink txid={`${address}.${contract}`}>
                <Caption
                  target="_blank"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  as="a"
                >
                  View contract
                </Caption>
              </TxLink>
            </Stack>
          </Stack>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" textAlign="right">
        <Text color={'textBody'} textAlign="right">
          {totalType === 'balance'
            ? ftDecimals(amount, ftMetadata?.decimals || 0)
            : parseInt(amount).toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
};
