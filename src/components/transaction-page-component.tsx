import { BlockQueryKeys, blockQK } from '@features/block/query-keys';
import { getBlockQueries } from '@features/block/use-block-queries';
import { TransactionQueryKeys, transactionQK } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import {
  CoinbaseTransaction,
  SmartContractTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types/generated';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { getContractId } from '@common/utils';

import { SkeletonTransactionSummary } from './loaders/skeleton-transaction';
import CoinbasePage from './tx/coinbase';
import ContractCallPage from './tx/contract-call';
import SmartContractPage from './tx/smart-contract';
import TokenTransferPage from './tx/token-transfer';

export const TransactionPageComponent = () => {
  const queries = useTransactionQueries();
  const { query } = useRouter();
  const txId = query.txid as string;
  const { data: transaction } = useQuery(
    transactionQK(TransactionQueryKeys.transaction, txId),
    queries.fetchSingleTransaction({ txId })
  );

  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const blockQueries = getBlockQueries(networkUrl);

  const { data: block } = useQuery(
    blockQK(
      BlockQueryKeys.block,
      (transaction && 'block_hash' in transaction && transaction.block_hash) || ''
    ),
    blockQueries.fetchBlock(
      (transaction && 'block_hash' in transaction && transaction.block_hash) || undefined
    ),
    { enabled: transaction && 'block_hash' in transaction }
  );

  if (!transaction) {
    return <SkeletonTransactionSummary />;
  }
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
