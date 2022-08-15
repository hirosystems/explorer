import { getContractId } from '@common/utils';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import {
  CoinbaseTransaction,
  SmartContractTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types/generated';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { SkeletonTransactionSummary } from './loaders/skeleton-transaction';
import CoinbasePage from './tx/coinbase';
import ContractCallPage from './tx/contract-call';
import SmartContractPage from './tx/smart-contract';
import TokenTransferPage from './tx/token-transfer';

export const TransactionPageComponent = () => {
  const queries = useTransactionQueries();
  const { query } = useRouter();
  const txId = query.txid as string;
  const { data } = useQuery(
    transactionQK(TransactionQueryKeys.transaction, txId),
    queries.fetchTransaction(txId)
  );
  const transaction = data?.transaction;
  if (!transaction) {
    return <SkeletonTransactionSummary />;
  }
  const block = data?.block;
  const contractId = getContractId(txId, transaction);

  switch (transaction?.tx_type) {
    case 'coinbase':
      return <CoinbasePage transaction={transaction as CoinbaseTransaction} block={block} />;
    case 'token_transfer':
      return (
        <TokenTransferPage transaction={transaction as TokenTransferTransaction} block={block} />
      );
    case 'contract_call':
      return (
        <ContractCallPage
          transaction={transaction as ContractCallTransaction}
          block={block}
          contractId={contractId}
        />
      );
    case 'smart_contract':
      return (
        <SmartContractPage
          transaction={transaction as SmartContractTransaction}
          block={block}
          contractId={contractId}
        />
      );
    case 'poison_microblock':
      return null;
    default:
      return null;
  }
};
