import * as React from 'react';
import { Link } from '@components/link';
import type { NextPage } from 'next';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { capitalize, microToStacks, truncateMiddle } from '@common/utils';

import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { Activity } from '@components/activity-row';

import { Meta } from '@components/meta-head';

import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IconAlertCircle } from '@tabler/icons';
import { AddressLink } from '@components/links';
import { microStxToStx } from '@stacks/ui-utils';
import { Flex, Grid, color, Box, Stack, GridProps } from '@stacks/ui';
import { getAccountPageQueries, getPrincipalFromCtx } from '@common/page-queries/account';
import { withInitialQueries } from '@common/with-initial-queries';
import {
  useAccountInViewBalances,
  useAccountInViewInfo,
  useAccountInViewTransactions,
} from '../../hooks/use-transaction-in-view';
import { StxBalances } from '@components/balances/stx-balance-card';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { hasTokenBalance } from '@common/utils/accounts';
import { Title } from '@components/typography';

const IncorrectAddressModeNotice: React.FC<{ address: string }> = ({ address }) => {
  const network = useNetworkMode();
  const invert =
    network && (network.toLowerCase() === 'testnet' || network.toLowerCase() === 'regtest')
      ? 'mainnet'
      : 'testnet';
  return (
    <Section mb="extra-loose">
      <Flex alignItems="center" justifyContent="space-between" p="base-loose">
        <Flex alignItems="center">
          <Box mr="tight" as={IconAlertCircle} color={color('feedback-alert')} />
          <Text color={color('text-body')}>
            This is a <strong>{capitalize(invert)}</strong> address, but you are viewing data from
            the <strong>{network}</strong> Stacks Network.
          </Text>
        </Flex>

        <AddressLink principal={address}>
          <Link
            fontSize={1}
            color={color('brand')}
            textDecoration="none"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            Update address
          </Link>
        </AddressLink>
      </Flex>
    </Section>
  );
};

const SummaryCard = ({ principal, hasTokenBalances, balances, transactions, nonce }: any) => {
  return (
    <Section mb={'extra-loose'} title="Summary">
      <Rows
        px="base"
        noTopBorder
        items={[
          {
            label: {
              children: 'Address',
            },
            children: principal,
            copy: principal,
          },
          {
            condition: !!transactions?.results?.length,
            label: {
              children: 'Activity',
            },
            children: <Activity txs={transactions?.results} amount={transactions?.total} />,
          },
          {
            condition: !!hasTokenBalances,
            label: {
              children: 'Holdings',
            },
            children: <TokenBalancesRow balances={balances} />,
          },
          {
            label: {
              children: 'Fees',
            },
            children: `${microToStacks(balances?.stx?.total_fees_sent || 0)} STX`,
          },
          {
            label: {
              children: 'Nonce',
            },
            children: nonce,
          },
        ]}
      />
    </Section>
  );
};

const PageTop = () => {
  return (
    <Flex
      mb="extra-loose"
      alignItems={['unset', 'unset', 'flex-end']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'row']}
    >
      <Title mb={['base', 'base', '0']} mt="64px" as="h1" color="white" fontSize="36px">
        Address details
      </Title>
    </Flex>
  );
};
const ContentWrapper = (props: GridProps) => {
  return (
    <Grid
      gridColumnGap="extra-loose"
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
      gridRowGap={['extra-loose', 'extra-loose', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
};
const AddressPage: NextPage<any> = ({ principal }) => {
  const balances = useAccountInViewBalances();
  const transactions = useAccountInViewTransactions();
  const info = useAccountInViewInfo();
  const hasTokenBalances = hasTokenBalance(balances);
  return (
    <>
      <Meta
        title={`STX Address ${truncateMiddle(principal)}`}
        labels={[
          {
            label: 'STX Balance',
            data: `${balances?.stx?.balance ? microStxToStx(balances.stx.balance) : 0} STX`,
          },
        ]}
      />
      <PageTop />
      <ContentWrapper>
        <SummaryCard
          principal={principal}
          hasTokenBalances={hasTokenBalances}
          transactions={transactions?.pages?.[0]}
          balances={balances}
          nonce={info?.nonce}
        />
        {balances && (
          <Stack spacing="extra-loose">
            <StxBalances principal={principal} balances={balances} />
            <TokenBalancesCard balances={balances} />
          </Stack>
        )}
      </ContentWrapper>
    </>
  );
};

AddressPage.getInitialProps = ctx => {
  const principal = getPrincipalFromCtx(ctx);
  return {
    principal,
    inView: {
      type: 'address',
      payload: principal,
    },
  };
};
export default withInitialQueries(AddressPage)(getAccountPageQueries);
