import React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { TxsListWithTabs } from '@modules/TransactionList/components/TxsListWithTabs';
import { PageWrapper } from '@components/page-wrapper';
import { DEFAULT_LIST_LIMIT } from '@common/constants';

import type { NextPage } from 'next';

const TransactionsPage: NextPage = () => {
  return (
    <PageWrapper>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Transactions
        </Title>
        <TxsListWithTabs infinite limit={DEFAULT_LIST_LIMIT} />
      </Box>
    </PageWrapper>
  );
};

export default TransactionsPage;
