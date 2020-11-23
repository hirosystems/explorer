import * as React from 'react';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { Box, color, FlexProps, Grid, GridProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { Section } from '@components/section';
import { border } from '@common/utils';
import { TokenAssetListItem } from '@components/balances/token-asset-list-item';
import { HoverableItem } from '@components/hoverable';

export const NftBalances: React.FC<{ balances: AddressBalanceResponse }> = ({ balances }) => (
  <>
    {Object.keys(balances.non_fungible_tokens).map((token, key, arr) => (
      <TokenAssetListItem
        token={token}
        type="non_fungible_tokens"
        balances={balances}
        key={key}
        isLast={key === arr.length - 1}
      />
    ))}
  </>
);

export const FtBalances: React.FC<{ balances: AddressBalanceResponse }> = ({ balances }) => (
  <>
    {Object.keys(balances.fungible_tokens).map((token, key, arr) => (
      <TokenAssetListItem
        token={token}
        type="fungible_tokens"
        balances={balances}
        key={key}
        isLast={key === arr.length - 1}
      />
    ))}
  </>
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

export const TokenBalancesCard: React.FC<FlexProps & { balances: AddressBalanceResponse }> = ({
  balances,
  ...rest
}) => {
  const [activeTab, setActiveTab] = React.useState<'ft' | 'nft'>('ft');

  const TabContent = activeTab === 'ft' ? FtBalances : NftBalances;

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
      <Box py="tight" maxHeight="500px" overflowY="auto">
        <TabContent balances={balances} />
      </Box>
    </Section>
  );
};
