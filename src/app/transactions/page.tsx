'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import { Box } from '@/ui/components';
import { Title } from '@/ui/typography';
import { NextPage } from 'next';
import React from 'react';

import { DefaultTxListTabs } from '../common/components/tx-lists/tabs/DefaultTxListTabs';

const TransactionsPage: NextPage = () => {
  return (
    <>
      <PageTitle>Transactions</PageTitle>
      <DefaultTxListTabs />
    </>
  );
};

export default TransactionsPage;
