import React, { memo } from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { NextPage, NextPageContext } from 'next';
import { prefetchTransactionsPageData } from '@common/lib/pages/transactions';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { useFetchTransactions } from '@common/hooks/data/use-fetch-transactions';
import {
  TRANSACTIONS_PAGE_TX_LIST_CONFIRMED,
  TRANSACTIONS_PAGE_TX_LIST_MEMPOOL,
} from '@common/constants/data';
import { useFilterState } from '@common/hooks/use-filter-state';

const ITEM_LIMIT = 50;

const TransactionsPage: NextPage<any> = () => {
  const { types } = useFilterState('txList');

  return (
    <>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Transactions
        </Title>
        <TabbedTransactionList
          infinite
          confirmed={{
            key: TRANSACTIONS_PAGE_TX_LIST_CONFIRMED,
            limit: ITEM_LIMIT,
            txTypes: types,
          }}
          mempool={{
            key: TRANSACTIONS_PAGE_TX_LIST_MEMPOOL,
            limit: ITEM_LIMIT,
            txTypes: types,
          }}
        />
      </Box>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { dehydratedState } = await prefetchTransactionsPageData(context);
  return {
    props: { dehydratedState },
  };
}

export default TransactionsPage;
