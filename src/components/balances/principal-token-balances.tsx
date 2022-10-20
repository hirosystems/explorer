import * as React from 'react';
import {
  AddressBalanceResponse,
  NonFungibleTokenHoldingsList,
} from '@stacks/stacks-blockchain-api-types';
import { Box, color, FlexProps, Grid, GridProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { Section } from '@components/section';
import { TokenAssetListItem } from '@components/balances/token-asset-list-item';
import { HoverableItem } from '@components/hoverable';
import { cvToJSON, hexToCV } from '@stacks/transactions';
import { useMemo } from 'react';
import { hexToString } from '@common/utils';

export const NftBalances: React.FC<{ balances: AddressBalanceResponse; bnsHexValues: any }> = ({
  balances,
  bnsHexValues,
}) =>
  Object.keys(balances.non_fungible_tokens).length ? (
    <>
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
    </>
  ) : (
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="base">
      <Caption>This account has no collectibles.</Caption>
    </Grid>
  );

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
    <Grid minHeight="220px" textAlign="center" placeItems="center" padding="base">
      <Caption>This account has no tokens.</Caption>
    </Grid>
  );

const Tab: React.FC<GridProps & { label: string; isActive?: boolean }> = ({
  label,
  isActive,
  ...rest
}) => (
  <Grid px="base" py="base-tight" placeItems="center" {...rest}>
    <Caption color={color(isActive ? 'text-title' : 'text-caption')}>{label}</Caption>
  </Grid>
);

const tabs: { label: string; slug: 'ft' | 'nft' }[] = [
  { label: 'Tokens', slug: 'ft' },
  { label: 'Collectibles', slug: 'nft' },
];

export const TokenBalancesCard: React.FC<
  FlexProps & { balances: AddressBalanceResponse; nftHoldings?: NonFungibleTokenHoldingsList }
> = ({ balances, nftHoldings, ...rest }) => {
  const [activeTab, setActiveTab] = React.useState<'ft' | 'nft'>('ft');

  const TabContent = activeTab === 'ft' ? FtBalances : NftBalances;

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
        }, {} as Record<string, { name?: string; namespace?: string }>),
    [nftHoldings]
  );

  console.log(222, bnsHexValues);

  return (
    <Section mb="extra-loose" title="Holdings" {...rest}>
      <Grid gridTemplateColumns={`repeat(${tabs.length}, 1fr)`} flexShrink={0}>
        {tabs.map(tab => {
          return (
            <HoverableItem isActive={tab.slug === activeTab} placement="bottom" key={tab.slug}>
              <Tab
                isActive={tab.slug === activeTab}
                onClick={() => setActiveTab(tab.slug)}
                label={tab.label}
              />
            </HoverableItem>
          );
        })}
      </Grid>
      <Box minHeight="220px" maxHeight="500px" overflowY="auto">
        <TabContent balances={balances} bnsHexValues={bnsHexValues} />
      </Box>
    </Section>
  );
};
