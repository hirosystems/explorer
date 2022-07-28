import * as React from 'react';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { Box, color, FlexProps, Grid, GridProps, Stack, Text } from '@stacks/ui';
import { Section } from '@components/section';
import { Caption } from '@components/typography';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { HoverableItem } from '@components/hoverable';
import { AccountTransactionList } from '@features/account-transaction-list';
import { PrincipalCollectible } from '@components/nfts/principal-collectibles';
import { FollowerList, FollowerListItemProps } from '@features/follower-list';

const fakeFollowers: FollowerListItemProps[] = [
  { address: 'SPVJSM1EEQK81JN8CD63M9Y84WTP6PDY0ZJJEA40', title: 'Founder & CEO @memorizely' },
  { address: 'SP2DZHWD7V2TYPF3VDJ329SFYD4TDQBD1XADY504G', title: 'Stacks maxi' },
  { address: 'SPGA0V94XE2CVPHWF4YEEERGEXJ8XFHFVT7Q1TF9', title: 'Megapont Hodler' },
  { address: 'SP1BSVBGXX5KZMZ2XJDFJDCW690MHGQ4KVPG08NRP', title: 'Dreamer by day' },
  { address: 'SP31HQPJJV470954AT85GPSTTRTP98JDCDEXDDRXX', title: 'Builder @StxLabs' },
  { address: 'SP1S7NXBWDEK7MD2FK7BGB42YK6WGEA8S78G3R4ZW', title: '3-time founder' },
];

export const Summary: React.FC<{
  address: string;
  balance: AddressBalanceResponse | undefined;
}> = ({ address }) => (
  <>
    <PrincipalCollectible principal={address} />
    <AccountTransactionList contractId={address} />
  </>
);

export const Transactions: React.FC<{
  address: string;
  balance: AddressBalanceResponse | undefined;
}> = ({ address }) => <AccountTransactionList contractId={address} />;

export const Tokens: React.FC<{
  address: string;
  balance: AddressBalanceResponse | undefined;
}> = ({ balance }) => <Stack>{balance && <TokenBalancesCard balances={balance} />}</Stack>;

export const Collectibles: React.FC<{
  address: string;
  balance: AddressBalanceResponse | undefined;
}> = ({ address }) => <PrincipalCollectible principal={address} />;

export const Following: React.FC<{
  address: string;
  balance: AddressBalanceResponse | undefined;
}> = ({ address }) => <FollowerList followers={fakeFollowers} />;

const Tab: React.FC<GridProps & { label: string; isActive?: boolean }> = ({
  label,
  isActive,
  ...rest
}) => (
  <Grid
    px="base"
    py="base-tight"
    placeItems="center"
    borderBottom={isActive ? '3px solid var(--colors-border)' : undefined}
    {...rest}
  >
    <Text fontSize={'16px'} fontWeight="500" color="white">
      {label}
    </Text>
  </Grid>
);

const tabs: { label: string; slug: 'summ' | 'tx' | 'tok' | 'coll' | 'foll' }[] = [
  { label: 'Summary', slug: 'summ' },
  { label: 'Transactions', slug: 'tx' },
  { label: 'Tokens', slug: 'tok' },
  { label: 'Collectibles', slug: 'coll' },
  { label: 'Following', slug: 'foll' },
];

export const NewAccountCard: React.FC<
  FlexProps & { address: string; balance: AddressBalanceResponse | undefined }
> = ({ balance, address, ...rest }) => {
  const [activeTab, setActiveTab] = React.useState<'summ' | 'tx' | 'tok' | 'coll' | 'foll'>('summ');

  let TabContent = Summary;
  switch (activeTab) {
    case 'tx':
      TabContent = Transactions;
      break;
    case 'tok':
      TabContent = Tokens;
      break;
    case 'coll':
      TabContent = Collectibles;
      break;
    case 'foll':
      TabContent = Following;
      break;
  }

  return (
    <Stack spacing="extra-loose">
      <Grid
        gridTemplateColumns={`repeat(${tabs.length}, 130px)`}
        flexShrink={0}
        style={{ marginTop: 65 }}
      >
        {tabs.map(tab => {
          return (
            <HoverableItem isActive={tab.slug === activeTab} placement="account" key={tab.slug}>
              <Tab
                isActive={tab.slug === activeTab}
                onClick={() => setActiveTab(tab.slug)}
                label={tab.label}
              />
            </HoverableItem>
          );
        })}
      </Grid>
      <TabContent address={address} balance={balance} />
    </Stack>
  );
};
