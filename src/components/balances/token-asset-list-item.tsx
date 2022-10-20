import { TokenAvatar } from '../token-avatar';
import React from 'react';
import { Box, color, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { TxLink } from '@components/links';
import { ftDecimals, getAssetNameParts, initBigNumber } from '@common/utils';
import { getTicker } from '@components/tx-events';
import { useTokenMetadata } from '../../common/hooks/use-token-metadata';

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
  const { address, asset, contract } = getAssetNameParts(token);

  const {
    ftMetadata: { data: ftMetadata },
    nftMetadata: { data: nftMetadata },
  } = useTokenMetadata(token, tokenType);

  const totalType = tokenType === 'non_fungible_tokens' ? 'count' : 'balance';

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;

  return (
    <Flex justifyContent="space-between" px="base" py="base">
      <Box>
        <Flex alignItems="center" mb={'extra-tight'}>
          <TokenAvatar token={token} tokenMetadata={ftMetadata || nftMetadata} />
          <Stack spacing="extra-tight">
            <Text color={color('text-title')} fontWeight="600">
              {bnsName || asset}
            </Text>
            <Stack isInline spacing="extra-tight" divider={<Caption>∙</Caption>} wrap="wrap">
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
        <Text color={color('text-body')} textAlign="right">
          {totalType === 'balance'
            ? ftDecimals(amount, ftMetadata?.decimals || 0)
            : parseInt(amount).toLocaleString()}
        </Text>
      </Flex>
    </Flex>
  );
};
