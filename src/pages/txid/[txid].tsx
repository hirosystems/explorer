import { NextPage, NextPageContext } from 'next';
import { toRelativeTime, truncateMiddle } from '@common/utils';

import CoinbasePage from '@components/tx/coinbase';
import ContractCallPage from '@components/tx/contract-call';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import PoisonMicroblockPage from '@components/tx/poison-microblock';
import React from 'react';
import { ReduxNextPageContext } from '@common/types/next-store';
import SmartContractPage from '@components/tx/smart-contract';
import TokenTransferPage from '@components/tx/token-transfer';
import { Transaction } from '@models/transaction.interface';
import { TxNotFound } from '@components/tx/not-found';
import { fetchTransaction } from '@store/transactions';
import { getTxTypeName } from '@common/transaction-names';
import { useDispatch } from 'react-redux';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import { useRefreshPendingTx } from '@common/hooks/use-refresh-pending-tx';
import { useTransactionState } from '@common/hooks/use-transaction-state';

const renderTxComponent = (transaction: Transaction) => {
  switch (transaction.tx_type) {
    case 'coinbase':
      return <CoinbasePage transaction={transaction} />;
    case 'token_transfer':
      return <TokenTransferPage transaction={transaction} />;
    case 'contract_call':
      return <ContractCallPage transaction={transaction} />;
    case 'smart_contract':
      return <SmartContractPage transaction={transaction} />;
    case 'poison_microblock':
      return <PoisonMicroblockPage transaction={transaction} />;
    default:
      throw new Error('Must pass valid transaction type');
  }
};

interface TransactionMetaProps {
  transaction: MempoolTransaction | Transaction;
}
const TransactionMeta: React.FC<TransactionMetaProps> = ({ transaction }) => {
  const ogTitle = `${getTxTypeName(transaction.tx_type)}${
    transaction.tx_id && ` transaction: ${truncateMiddle(transaction.tx_id, 10)}`
  }`;
  const ogUrl = `/txid/${transaction.tx_id}`;
  const subject = transaction.sponsored ? 'Sponsored transaction' : 'Transaction';
  const ogDescription = `
    ${subject} initiated by ${transaction.sender_address}`;

  const labels =
    'burn_block_time' in transaction
      ? [
          {
            label: 'Confirmation',
            data: `${toRelativeTime(transaction?.burn_block_time * 1000)}, in block #${
              transaction.block_height
            }`,
          },
        ]
      : undefined;

  return (
    <Meta
      title={`${getTxTypeName(transaction.tx_type)} - Stacks 2.0 explorer`}
      ogTitle={ogTitle}
      description={ogDescription}
      url={ogUrl}
      status={transaction.tx_status}
      key={transaction.tx_status}
      labels={labels}
    />
  );
};

const TransactionPage: NextPage<{ txid?: string }> = ({ txid }) => {
  const dispatch = useDispatch();
  const { transaction, loading, error } = useTransactionState(txid);

  txid && useRefreshPendingTx(txid);
  useRecentlyViewedTx(transaction);

  // eslint-disable-next-line @typescript-eslint/require-await
  const handleRefresh = async (query?: string) => {
    if (!loading) {
      return query
        ? dispatch(fetchTransaction(query))
        : txid
        ? dispatch(fetchTransaction(txid))
        : undefined;
    }
  };

  if (error || !transaction)
    return (
      <PageWrapper>
        <TxNotFound refresh={handleRefresh} />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <TransactionMeta transaction={transaction} />
      {transaction && renderTxComponent(transaction)}
    </PageWrapper>
  );
};

TransactionPage.getInitialProps = async ({
  store,
  query,
}: NextPageContext & ReduxNextPageContext): Promise<{ txid?: string }> => {
  const { txid } = query;
  const { dispatch } = store;
  if (txid) {
    await dispatch(fetchTransaction(txid.toString()));
    return { txid: txid.toString() };
  }
  return {
    txid: undefined,
  };
};

export default TransactionPage;
