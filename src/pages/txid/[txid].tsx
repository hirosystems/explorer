import React from 'react';
import Head from 'next/head';

import { Transaction } from '@models/transaction.interface';
import { fetchTransaction } from '@store/transactions';
import { API_SERVER } from '@common/constants';
import { ReduxNextPageContext } from '@common/types/next-store';
import { useTransactionState } from '@common/hooks/use-transaction-state';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import { truncateMiddle } from '@common/utils';

import { PageWrapper } from '@components/page';
import CoinbasePage from '@components/tx/coinbase';
import TokenTransferPage from '@components/tx/token-transfer';
import SmartContractPage from '@components/tx/smart-contract';
import PoisonMicroblockPage from '@components/tx/poison-microblock';
import ContractCallPage from '@components/tx/contract-call';
import { TxNotFound } from '@components/tx/not-found';
import { getTxTypeName } from '@common/transaction-names';

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

const TransactionPage = ({ tx_id }: Pick<Transaction, 'tx_id'>) => {
  const { transaction, error } = useTransactionState(tx_id);

  if (error || !transaction)
    return (
      <PageWrapper>
        <TxNotFound />
      </PageWrapper>
    );

  useRecentlyViewedTx(transaction);

  const ogTitle = `${getTxTypeName(transaction.tx_type)} transaction: ${truncateMiddle(tx_id, 10)}`;
  const ogUrl = `${API_SERVER}/txid/${transaction.tx_id}`;
  const subject = transaction.sponsored ? 'Sponsored transaction' : 'Transaction';
  const ogDescription = `
    ${subject} initiated by ${transaction.sender_address} confirmed in block #${transaction.block_height}`;

  return (
    <PageWrapper>
      <Head>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:description" content={ogDescription} />
      </Head>
      {transaction && renderTxComponent(transaction)}
    </PageWrapper>
  );
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const txid = query?.txid.toString();
  await Promise.all([store.dispatch(fetchTransaction(txid))]);
  return { tx_id: txid };
};

export default TransactionPage;
