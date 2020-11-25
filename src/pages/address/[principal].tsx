import * as React from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import {
  AddressBalanceResponse,
  MempoolTransaction,
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Grid } from '@stacks/ui';
import { Title } from '@components/typography';
import type { NextPage, NextPageContext } from 'next';
import { PageWrapper } from '@components/page';
import { Section } from '@components/section';
import { Rows } from '@components/rows';
import { TransactionList } from '@components/transaction-list';
import { microToStacks, truncateMiddle, validateStacksAddress } from '@common/utils';
import { useApiServer } from '@common/hooks/use-api';
import { getServerSideApiServer } from '@common/api/utils';
import { fetchAllAccountData } from '@common/api/accounts';
import { TokenBalancesRow } from '@components/balances/token-balances-row';
import { Activity } from '@components/activity-row';
import { StxBalances } from '@components/balances/stx-balance-card';
import { getStackStartBlockHeight, hasTokenBalance } from '@common/utils/accounts';
import { TokenBalancesCard } from '@components/balances/principal-token-balances';
import { Meta } from '@components/meta-head';
import { AddressNotFound } from '@components/address-not-found';

const SummaryCard = ({ principal, hasTokenBalances, data }: any) => {
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
            condition: !!data?.transactions?.results?.length,
            label: {
              children: 'Activity',
            },
            children: <Activity txs={data?.transactions?.results} />,
          },
          {
            condition: !!hasTokenBalances,
            label: {
              children: 'Holdings',
            },
            children: <TokenBalancesRow balances={data?.balances} />,
          },
          {
            label: {
              children: 'Fees',
            },
            children: `${microToStacks(data?.balances?.stx?.total_fees_sent || 0)} STX`,
          },
        ]}
      />
    </Section>
  );
};

interface AddressPageData {
  principal: string;
  balances?: AddressBalanceResponse;
  transactions?: TransactionResults | MempoolTransactionListResponse;
  pendingTransactions?: MempoolTransaction[];
  error?: boolean;
}

const AddressPage: NextPage<AddressPageData> = props => {
  const { principal, balances, pendingTransactions, transactions, error } = props;
  if (error) {
    return (
      <>
        <Meta title="Address not found" />
        <AddressNotFound />
      </>
    );
  }
  const apiServer = useApiServer();
  const { data } = useSWR(principal, fetchAllAccountData(apiServer as any), {
    initialData: {
      balances,
      transactions,
      pendingTransactions,
    },
  });
  const hasTokenBalances = hasTokenBalance(data?.balances);
  const stackingStartedAtThisBlock = getStackStartBlockHeight(data?.transactions?.results);

  return (
    <PageWrapper>
      <Meta title={`STX Address ${truncateMiddle(principal)}`} />
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
      <Grid
        gridColumnGap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
        gridRowGap={['extra-loose', 'extra-loose', 'unset']}
        maxWidth="100%"
        alignItems="flex-start"
      >
        <Box>
          <SummaryCard principal={principal} hasTokenBalances={hasTokenBalances} data={data} />
          {data?.transactions?.results ? (
            <TransactionList
              showCoinbase
              hideFilter={false}
              principal={principal}
              transactions={data.transactions.results as any}
            />
          ) : null}
        </Box>
        {balances ? (
          <Box>
            <StxBalances
              principal={principal}
              stackingBlock={stackingStartedAtThisBlock}
              balances={balances}
            />
            {data?.balances && hasTokenBalance(data.balances) ? (
              <TokenBalancesCard mt="extra-loose" balances={data.balances} />
            ) : null}
          </Box>
        ) : null}
      </Grid>
    </PageWrapper>
  );
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{ props: AddressPageData }> {
  const { query } = ctx;
  const principal: string = query?.principal as string;
  const validAddress = validateStacksAddress(principal);
  console.log('valid', validAddress);
  if (!validAddress) {
    return {
      props: {
        principal,
        error: true,
      },
    } as any;
  }
  const apiServer = getServerSideApiServer(ctx);
  const data = await fetchAllAccountData(apiServer)(principal);
  return {
    props: { principal, ...data },
  };
}

export default AddressPage;
