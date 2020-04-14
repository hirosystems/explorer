import React from 'react';
import { useSelector } from 'react-redux';
import { Transaction } from '@models/transaction.interface';
import { RootState } from '@store';
import {
  fetchTransactionDone,
  fetchTransactionFailed,
  selectTransaction,
} from '@store/transactions';
import { ReduxNextPageContext } from '@common/types/next-store';
import { fetchTx } from '@common/api/transactions';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import CoinbasePage from '../tx/coinbase';
import TokenTransferPage from '../tx/token-transfer';
import SmartContractPage from '../tx/smart-contract';
import PoisonMicroblockPage from '../tx/poison-microblock';
import ContractCallPage from '../tx/contract-call';
import { TxNotFound } from '@pages/tx/not-found';
import { PageWrapper } from '@components/page';

const getTxComponent = (transaction?: Transaction) => {
  if (!transaction) return <TxNotFound />;

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
  const { transaction } = useSelector((state: RootState) => ({
    transaction: selectTransaction(tx_id)(state),
  }));

  useRecentlyViewedTx(transaction);

  return <PageWrapper>{getTxComponent(transaction)}</PageWrapper>;
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const txid = query.txid.toString();
  try {
    const { transaction } = await fetchTx({ txid });
    store.dispatch(fetchTransactionDone(transaction));
  } catch (e) {
    store.dispatch(fetchTransactionFailed({ txid }));
  }
  return { tx_id: txid };
};

export default TransactionPage;
