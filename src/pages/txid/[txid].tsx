import * as React from 'react';
import { PageWrapper } from '@components/page';
import { TransactionMeta } from '@components/meta/transactions';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

import { queryWith0x, validateTxId } from '@common/utils';
import { renderTxPageComponent } from '@common/render-tx-page';
import { useTransactionPageData } from '@common/hooks/use-transaction-page-data';
import { getServerSideApiServer } from '@common/api/utils';
import { fetchTransaction, FetchTransactionResponse } from '@common/api/transactions';
import { fetchBlock } from '@common/api/blocks';

import type { NextPage, NextPageContext } from 'next';
import type { Block } from '@blockstack/stacks-blockchain-api-types';
import { useApiServer } from '@common/hooks/use-api';
import { Meta } from '@components/meta-head';

// @ts-ignore
const TxNotFound = dynamic(() =>
  import('../../components/tx-not-found').then(mod => mod.TxNotFound)
);

const TransactionPage: NextPage<{
  txid: string;
  initialData: FetchTransactionResponse;
  block?: Block;
}> = ({ txid, initialData, block }) => {
  const { transaction, data, error } = useTransactionPageData({ txid, initialData });
  const apiServer = useApiServer();

  const hash = transaction && 'block_hash' in transaction && transaction.block_hash;

  const { data: blockData } = useSWR(hash || '', fetchBlock(apiServer), {
    initialData: block,
    refreshInterval: transaction?.tx_status === 'pending' ? 3500 : undefined,
  });

  const hasInitialError = 'error' in initialData && initialData.error;

  const isPossiblyValid = validateTxId(txid);

  if (hasInitialError || error || !data || !transaction) {
    return (
      <>
        <Meta title="Transaction not found" />
        <TxNotFound isPending={isPossiblyValid} />
      </>
    );
  } else {
    return (
      <PageWrapper>
        <TransactionMeta transaction={transaction} />
        {transaction && renderTxPageComponent(data, blockData)}
      </PageWrapper>
    );
  }
};

export async function getServerSideProps(
  ctx: NextPageContext
): Promise<{
  props: {
    txid: string;
    initialData: FetchTransactionResponse;
    block?: Block;
  };
}> {
  const apiServer = getServerSideApiServer(ctx);
  const { query } = ctx;
  const txid = query?.txid ? queryWith0x(query?.txid.toString()) : '';
  const initialData = await fetchTransaction(apiServer)(txid.toString());

  let block = null;
  if ('transaction' in initialData && 'block_hash' in initialData.transaction) {
    const hash = initialData.transaction.block_hash;
    block = await fetchBlock(apiServer)(hash);
  }

  return {
    props: {
      txid,
      initialData,
      block: block as Block,
    },
  };
}

export default TransactionPage;
