import * as React from 'react';
import CoinbasePage from './tx/coinbase';
import ContractCallPage from './tx/contract-call';
import SmartContractPage from './tx/smart-contract';
import TokenTransferPage from './tx/token-transfer';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { getContractId } from '@common/utils';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types/generated';
import {
  CoinbaseTransaction,
  SmartContractTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';

export const TransactionPageComponent = () => {
  const queries = useTransactionQueries();
  const { query } = useRouter();
  const txPageQuery = query.txid as string;
  const { data } = useQuery(['transaction', txPageQuery], queries.fetchTransaction(txPageQuery));
  const transaction = data?.transaction;
  const block = data?.block;
  const contractId = getContractId(txPageQuery, transaction);

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
