'use client';

import { NextPage } from 'next';
import React from 'react';

import { DefaultTxListTabs } from '../../common/components/tx-lists/tabs/DefaultTxListTabs';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';

const TransactionsPage: NextPage = () => {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>Transactions</PageTitle>
      <DefaultTxListTabs />
    </Flex>
  );
};

export default TransactionsPage;
