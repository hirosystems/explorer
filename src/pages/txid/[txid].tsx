import React from 'react';
import { Transaction } from '@models/transaction.interface';
import { fetchTransaction } from '@store/transactions';
import { ReduxNextPageContext } from '@common/types/next-store';
import { useTransactionState } from '@common/hooks/use-transaction-state';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import { truncateMiddle, toRelativeTime } from '@common/utils';
import { useDispatch } from 'react-redux';
import { PageWrapper } from '@components/page';
import { Meta } from '@components/meta-head';
import CoinbasePage from '@components/tx/coinbase';
import TokenTransferPage from '@components/tx/token-transfer';
import SmartContractPage from '@components/tx/smart-contract';
import PoisonMicroblockPage from '@components/tx/poison-microblock';
import ContractCallPage from '@components/tx/contract-call';
import { TxNotFound } from '@components/tx/not-found';
import { getTxTypeName } from '@common/transaction-names';
import { useRefreshPendingTx } from '@common/hooks/use-refresh-pending-tx';

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

const TransactionMeta = ({ transaction }: any) => {
  const ogTitle = `${getTxTypeName(transaction.tx_type)}${
    transaction.tx_id && ` transaction: ${truncateMiddle(transaction.tx_id, 10)}`
  }`;
  const ogUrl = `/txid/${transaction.tx_id}`;
  const subject = transaction.sponsored ? 'Sponsored transaction' : 'Transaction';
  const ogDescription = `
    ${subject} initiated by ${transaction.sender_address}`;

  const labels = [
    {
      label: 'Confirmation',
      data: `${toRelativeTime(transaction?.burn_block_time * 1000)}, in block #${
        transaction.block_height
      }`,
    },
  ];

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

const TransactionPage = ({ txid }: { txid: string }) => {
  const dispatch = useDispatch();
  const { transaction, loading, error } = useTransactionState(txid as string);

  useRefreshPendingTx(txid);
  useRecentlyViewedTx(transaction);

  const handleRefresh = async (query?: string) => {
    if (!loading) {
      return dispatch(fetchTransaction(query || txid));
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

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const { txid } = query;
  const { dispatch } = store;
  if (txid) {
    await dispatch(fetchTransaction(txid.toString()));
    return { txid: txid.toString() };
  }
  return {};
};

export default TransactionPage;
