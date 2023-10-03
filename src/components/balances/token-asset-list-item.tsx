import React from 'react';
import { NonFungibleTokenHolding } from '@stacks/stacks-blockchain-api-types/generated';
import { hexToCV, IntCV } from '@stacks/transactions';
import { useFtMetadata } from '@/appPages/common/queries/useFtMetadata';
import { useNftMetadata } from '@/appPages/common/queries/useNftMetadata';
import { useApi } from '@/common/api/client';
import { ftDecimals, getAssetNameParts, initBigNumber } from '@/common/utils';
import { TokenLink } from '@/components/links';
import { getTicker } from '@/components/tx-events';
import { Box, Flex, FlexProps, Stack } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';

import { FtAvatar, NftAvatar } from '../token-avatar';

interface TokenAssetListItemProps extends FlexProps {
  amount: string;
  token: string;
  tokenType: 'non_fungible_tokens' | 'fungible_tokens';
  bnsName?: string;
  holdings?: NonFungibleTokenHolding[];
}
export function TokenAssetListItem({
  amount,
  token,
  tokenType,
  bnsName,
  holdings,
}: TokenAssetListItemProps) {
  const api = useApi();
  const { address, asset, contract } = getAssetNameParts(token);
  const contractId = `${address}.${contract}`;
  const firstNftValue = holdings?.length
    ? (hexToCV(holdings[0].value.hex) as IntCV).value
    : undefined;

  const { data: ftMetadata } = useFtMetadata(
    api,
    { contractId },
    { enabled: tokenType === 'fungible_tokens' }
  );
  const { data: nftMetadata } = useNftMetadata(
    api,
    { contractId, tokenId: Number(firstNftValue) },
    { enabled: tokenType === 'non_fungible_tokens' && !!firstNftValue, retry: 1, retryDelay: 2000 }
  );

  const totalType = tokenType === 'non_fungible_tokens' ? 'count' : 'balance';
  const metadata = tokenType === 'non_fungible_tokens' ? nftMetadata : ftMetadata;

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;

  return (
    <Flex justifyContent="space-between" px="16px" py="16px">
      <Box>
        <Flex alignItems="center" mb="4px" gap="4px">
          {tokenType === 'non_fungible_tokens' ? (
            <NftAvatar token={token} tokenMetadata={nftMetadata} />
          ) : (
            <FtAvatar token={token} tokenMetadata={ftMetadata} />
          )}
          <Stack spacing="4px">
            <Text color="textTitle" fontWeight="600">
              {bnsName || asset}
            </Text>
            <Stack isInline gap="4px" divider={<Caption>∙</Caption>} wrap="wrap">
              <Caption>
                {tokenType === 'fungible_tokens'
                  ? ftMetadata?.symbol || getTicker(asset).toUpperCase()
                  : getTicker(asset).toUpperCase()}
              </Caption>
              <TokenLink tokenId={`${address}.${contract}`}>
                <Caption
                  target="_blank"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                  as="a"
                >
                  View token
                </Caption>
              </TokenLink>
            </Stack>
          </Stack>
        </Flex>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" textAlign="right">
        <Text color="textBody" textAlign="right">
          {totalType === 'balance'
            ? ftDecimals(amount, ftMetadata?.decimals || 0)
            : parseInt(amount).toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
}
