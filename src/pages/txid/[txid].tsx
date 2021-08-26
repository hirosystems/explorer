import React from 'react';
import { withInitialQueries } from 'jotai-query-toolkit/nextjs';
import { pageAtomBuilders } from '@common/page-queries/extra-initial-values';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';
import { getTxPageQueries, getTxPageQueryProps } from '@common/page-queries/txid';

import { getTxIdFromCtx, validateContractName, validateTxId } from '@common/utils';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

import type { NextPage, NextPageContext } from 'next';
import type { TxPageQueryProps } from '@common/page-queries/txid';
import { Meta } from '@components/meta-head';
import { TxNotFound } from '@components/tx-not-found';
import { InView } from '@store/currently-in-view';

interface TransactionPageProps {
  inView: InView;
  isPossiblyValid?: boolean;
  error?: boolean;
}

const TransactionPage: NextPage<TransactionPageProps> = ({ error, isPossiblyValid }) => {
  if (error)
    return (
      <>
        <Meta title="Transaction not found" />
        <TxNotFound isPending={isPossiblyValid} />
      </>
    );

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
  const isPossiblyValid = type === 'tx' ? validateTxId(payload) : validateContractName(payload);
  return {
    inView: { type, payload },
    isPossiblyValid,
  };
};

export default withInitialQueries<TxPageQueryProps, TransactionPageProps>(
  TransactionPage,
  pageAtomBuilders
)(getTxPageQueries, getTxPageQueryProps);
