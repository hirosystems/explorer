import * as React from 'react';
import { withInitialQueries } from 'jotai-query-toolkit/nextjs';
import { pageAtomBuilders } from '@common/page-queries/extra-initial-values';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';
import { getTxPageQueries, getTxPageQueryProps } from '@common/page-queries/txid';

import { getTxIdFromCtx } from '@common/utils';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

import type { NextPage, NextPageContext } from 'next';
import type { TxPageQueryProps } from '@common/page-queries/txid';

const TransactionPage: NextPage = () => {
  useRefreshOnBack('txid');
  return (
    <>
      <TransactionMeta />
      <TransactionPageComponent />
    </>
  );
};

TransactionPage.getInitialProps = (ctx: NextPageContext) => {
  const payload = getTxIdFromCtx(ctx);
  const type = payload.includes('.') ? 'contract_id' : 'tx';
  return {
    inView: { type, payload },
    key: payload,
  };
};

export default withInitialQueries<TxPageQueryProps>(TransactionPage, pageAtomBuilders)(
  getTxPageQueries,
  getTxPageQueryProps
);
