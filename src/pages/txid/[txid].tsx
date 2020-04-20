import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Transaction } from '@models/transaction.interface';
import { fetchTransaction } from '@store/transactions';
import { API_SERVER } from '@common/constants';
import { ReduxNextPageContext } from '@common/types/next-store';
import { useTransactionState } from '@common/hooks/use-transaction-state';
import { useMostRecentTxId } from '@common/hooks/use-most-recent-tx';
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

const TransactionPage = ({ searchQuery }: { searchQuery: string }) => {
  const tx_id = useMostRecentTxId();
  const { transaction, error } = useTransactionState(tx_id as string);
  const router = useRouter();

  if (error || !transaction)
    return (
      <PageWrapper>
        <TxNotFound />
      </PageWrapper>
    );

  React.useEffect(() => {
    if (searchQuery !== tx_id && router.pathname !== tx_id) {
      router.push('/txid/[txid]', `/txid/${tx_id}`, { shallow: true });
    }
  }, [router.pathname]);

  useRecentlyViewedTx(transaction);

  const ogTitle = `${getTxTypeName(transaction.tx_type)}${
    tx_id && ` transaction: ${truncateMiddle(tx_id, 10)}`
  }`;
  const ogUrl = `${API_SERVER}/txid/${transaction.tx_id}`;
  const subject = transaction.sponsored ? 'Sponsored transaction' : 'Transaction';
  const ogDescription = `
    ${subject} initiated by ${transaction.sender_address} confirmed in block #${transaction.block_height}`;

  return (
    <PageWrapper>
      <Head>
        <title>Stacks 2.0 explorer – {getTxTypeName(transaction.tx_type)}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:description" content={ogDescription} />
      </Head>
      {transaction && renderTxComponent(transaction)}
    </PageWrapper>
  );
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const searchQuery = query?.txid.toString();
  await Promise.all([store.dispatch(fetchTransaction(searchQuery))]);
  return { searchQuery };
};

export default TransactionPage;
