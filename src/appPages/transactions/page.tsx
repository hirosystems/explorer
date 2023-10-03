import { NextPage } from 'next';
import React from 'react';
import { PageTitle } from '@/appPages/common/components/PageTitle';

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
