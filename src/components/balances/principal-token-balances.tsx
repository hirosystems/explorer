import { useVerticallyStackedElementsBorderStyle } from '@/app/common/styles/border';
import { hexToString } from '@/common/utils';
import { TokenAssetListItem } from '@/components/balances/token-asset-list-item';
import { Section } from '@/components/section';
import { Box, FlexProps, Grid, Tab, TabList, TabPanel, TabPanels, Tabs } from '@/ui/components';
import { Caption } from '@/ui/typography';
import * as React from 'react';
import { useMemo } from 'react';

import {
  AddressBalanceResponse,
  NonFungibleTokenHoldingsList,
} from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

export const NftBalances: React.FC<{ balances: AddressBalanceResponse; bnsHexValues: any }> = ({
  balances,
  bnsHexValues,
}) => {
  const verticallyStackedElementsBorderStyle = useVerticallyStackedElementsBorderStyle();
  return Object.keys(balances.non_fungible_tokens).length ? (
    <Box css={verticallyStackedElementsBorderStyle}>
      {Object.keys(balances.non_fungible_tokens).map((key, index, arr) => (
        <TokenAssetListItem
          amount={balances.non_fungible_tokens[key]?.count || ''}
          key={index}
          token={key}
          tokenType="non_fungible_tokens"
          bnsName={
            bnsHexValues[key]
              ? `${bnsHexValues[key].name}.${bnsHexValues[key].namespace}`
              : undefined
          }
        />
      ))}
    </Box>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="16px">
      <Caption>This account has no collectibles.</Caption>
    </Grid>
  );
};

export const FtBalances: React.FC<{ balances: AddressBalanceResponse }> = ({ balances }) =>
  Object.keys(balances.fungible_tokens).length ? (
    <>
      {Object.keys(balances.fungible_tokens).map((key, index, arr) => (
        <TokenAssetListItem
          amount={balances.fungible_tokens[key]?.balance || ''}
          key={index}
          token={key}
          tokenType="fungible_tokens"
        />
      ))}
    </>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="16px">
      <Caption>This account has no tokens.</Caption>
    </Grid>
  );

export const TokenBalancesCard: React.FC<
  FlexProps & { balances: AddressBalanceResponse; nftHoldings?: NonFungibleTokenHoldingsList }
> = ({ balances, nftHoldings, ...rest }) => {
  const bnsHexValues = useMemo(
    () =>
      nftHoldings?.results
        ?.filter(nftHolding => nftHolding.asset_identifier.endsWith('.bns::names'))
        ?.reduce((acc, data) => {
          acc[data.asset_identifier] = data.value?.hex
            ? {
                name: hexToString(
                  cvToJSON(hexToCV(data.value.hex))?.value?.name?.value?.replace('0x', '')
                ),
                namespace: hexToString(
                  cvToJSON(hexToCV(data.value.hex))?.value?.namespace?.value?.replace('0x', '')
                ),
              }
            : {};
          return acc;
        }, {} as Record<string, { name?: string; namespace?: string }>) || {},
    [nftHoldings]
  );

  return (
    <Section mb="32px" title="Holdings" {...rest}>
      <Tabs variant={'soft-rounded'} borderRadius={'0px'} border={'none'} isLazy bg={'transparent'}>
        <TabList>
          <Tab fontSize="12px">Tokens</Tab>
          <Tab fontSize="12px">Collectibles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FtBalances balances={balances} />
          </TabPanel>
          <TabPanel>
            <NftBalances balances={balances} bnsHexValues={bnsHexValues} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Section>
  );
};
