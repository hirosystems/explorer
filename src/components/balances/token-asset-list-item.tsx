import React, { useEffect, useState } from 'react';
import { FungibleTokenMetadata } from '@stacks/blockchain-api-client';
import { Box, color, DynamicColorCircle, Flex, FlexProps, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { TxLink } from '@components/links';
import { ftDecimals, getAssetNameParts, initBigNumber } from '@common/utils';
import { getTicker } from '@components/tx-events';
import { useApi } from '@common/api/client';
import { useQuery } from 'react-query';

const tokenContractIdToTickerId = {
  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko': 'arkadiko-protocol',
  'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5.newyorkcitycoin-token::newyorkcitycoin': 'nycccoin',
};

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
  const [tokenBalanceUsd, setTokenBalanceUsd] = useState<number | undefined>();

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

  //@ts-ignore
  const tickerId = tokenContractIdToTickerId[token];

  const { data: tokenTicker } = useQuery(
    ['token-ticker' + tickerId],
    () =>
      fetch(`https://api.coingecko.com/api/v3/coins/${tickerId}/tickers`).then(res => res.json()),
    {
      enabled: !!tickerId,
      refetchInterval: 5000,
      staleTime: 5000,
    }
  );
  console.log('datatoken', tokenTicker);
  const totalType = tokenType === 'non_fungible_tokens' ? 'count' : 'balance';

  useEffect(() => {
    if (!tokenTicker) return;
    const tokenPriceUsd = tokenTicker.tickers.find(t => t.target === 'USD');
    if (!tokenPriceUsd) return;
    const quantity =
      totalType === 'balance'
        ? ftDecimals(amount, ftMetadata?.decimals || 0)
        : parseInt(amount).toLocaleString();
    const finalAmount = parseInt(quantity.replace(/,/g, ''), 10);
    // warning some precision error below
    setTokenBalanceUsd(tokenPriceUsd.last * finalAmount);
  }, [tokenTicker, totalType, ftMetadata, amount]);

  if (initBigNumber(amount).isLessThanOrEqualTo(0)) return null;
  console.log('TokenAssetListItem', token, tokenType, amount, ftMetadata);

  return (
    <Flex justifyContent="space-between" px="base" py="base">
      <Box>
        <Flex alignItems="center" mb={'extra-tight'}>
          {ftMetadata?.image_canonical_uri ? (
            <img
              width={'36px'}
              height={'36px'}
              src={encodeURI(ftMetadata.image_canonical_uri)}
              style={{ marginRight: '16px' }}
            />
          ) : (
            <DynamicColorCircle size="32px" mr="base" string={`${address}.${contract}::${asset}`}>
              {asset[0]}
            </DynamicColorCircle>
          )}
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
      <Flex
        justifyContent="flex-end"
        alignItems="normal"
        textAlign="right"
        flexDirection={'column'}
      >
        <Text color={color('text-body')} textAlign="right">
          {totalType === 'balance'
            ? ftDecimals(amount, ftMetadata?.decimals || 0)
            : parseInt(amount).toLocaleString()}
        </Text>
        <Text fontSize="14px" color={'#747478'} marginTop={'4px'} textAlign="right">
          {tokenBalanceUsd ? `$${tokenBalanceUsd.toFixed(2)}` : ' '}
        </Text>
      </Flex>
    </Flex>
  );
};
