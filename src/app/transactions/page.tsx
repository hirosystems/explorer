'use client';

import { NextPage } from 'next';
import React from 'react';

import { TxListTabs } from '../../features/txs-list/tabs/TxListTabs';
import { PageTitle } from '../_components/PageTitle';

const TransactionsPage: NextPage = () => {
  return (
    <>
      <PageTitle>Transactions</PageTitle>
      <TxListTabs />
    </>
  );
};

export default TransactionsPage;
