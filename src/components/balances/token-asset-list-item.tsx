import React, { useEffect, useState } from 'react';
import { FungibleTokenMetadata } from '@stacks/blockchain-api-client';
import { Box, color, DynamicColorCircle, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { TxLink } from '@components/links';
import { ftDecimals, getAssetNameParts, initBigNumber } from '@common/utils';
import { getTicker } from '@components/tx-events';
import { useApi } from '@common/api/client';

interface TokenAssetListItemProps extends FlexProps {
  amount: string;
  token: string;
  tokenType: 'non_fungible_tokens' | 'fungible_tokens';
}
export const TokenAssetListItem: React.FC<TokenAssetListItemProps> = ({
  amount,
  token,
  tokenType,
}) => {
  const [ftMetadata, setFtMetadata] = useState<FungibleTokenMetadata | undefined>();
  const { fungibleTokensApi } = useApi();
  const { address, asset, contract } = getAssetNameParts(token);

  useEffect(() => {
    // TODO: Revisit this bc duplicated code in several places
    const getFtMetadata = async () => {
      const contractId = `${address}.${contract}`;
      const data = await fungibleTokensApi.getContractFtMetadata({
        contractId,
      });
      setFtMetadata(data);
    };
    if (tokenType === 'fungible_tokens') void getFtMetadata();
  }, []);

  const totalType = tokenType === 'non_fungible_tokens' ? 'count' : 'balance';

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;

  return (
    <Flex justifyContent="space-between" px="base" py="base">
      <Box>
        <Flex alignItems="center" mb={'extra-tight'}>
          <DynamicColorCircle size="32px" mr="base" string={`${address}.${contract}::${asset}`}>
            {asset[0]}
          </DynamicColorCircle>
          <Stack spacing="extra-tight">
            <Text color={color('text-title')} fontWeight="600">
              {asset}
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
