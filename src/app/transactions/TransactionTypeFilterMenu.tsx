import { useCallback, useMemo } from 'react';

import { MempoolFeePriorities } from '@stacks/blockchain-api-client';

import { FilterMenu } from '../../common/components/FilterMenu';

export enum TransactionTypeFilterTypes {
  AverageForAllTransactions = 'AverageForAllTransactions',
  AverageForTokenTransfers = 'AverageForTokenTransfers',
  AverageForFunctionCalls = 'AverageForFunctionCalls',
  AverageForContractDeploys = 'AverageForContractDeploys',
}

function getTransactionTypeFilterLabel(transactionType: TransactionTypeFilterTypes) {
  if (transactionType === TransactionTypeFilterTypes.AverageForAllTransactions) {
    return 'Average for all transactions';
  }
  if (transactionType === TransactionTypeFilterTypes.AverageForTokenTransfers) {
    return 'Average for token transfers';
  }
  if (transactionType === TransactionTypeFilterTypes.AverageForFunctionCalls) {
    return 'Average for function calls';
  }
  if (transactionType === TransactionTypeFilterTypes.AverageForContractDeploys) {
    return 'Average for contract deploys';
  }
  throw new Error('Invalid transactionType');
}

export function mapTransactionTypeToFilterValue(
  txType: TransactionTypeFilterTypes
): keyof MempoolFeePriorities {
  if (txType === TransactionTypeFilterTypes.AverageForAllTransactions) {
    return 'all';
  }
  if (txType === TransactionTypeFilterTypes.AverageForTokenTransfers) {
    return 'token_transfer';
  }
  if (txType === TransactionTypeFilterTypes.AverageForFunctionCalls) {
    return 'contract_call';
  }
  if (txType === TransactionTypeFilterTypes.AverageForContractDeploys) {
    return 'smart_contract';
  }
  throw new Error('txType');
}

export function TransactionTypeFilterMenu({
  transactionType,
  setTransactionType,
}: {
  transactionType: TransactionTypeFilterTypes;
  setTransactionType: (transactionType: TransactionTypeFilterTypes) => void;
}) {
  const menuItems = useMemo(
    () =>
      Object.keys(TransactionTypeFilterTypes).map(filterType => ({
        onClick: () => setTransactionType(filterType as TransactionTypeFilterTypes),
        label: getTransactionTypeFilterLabel(filterType as TransactionTypeFilterTypes),
      })),
    [setTransactionType]
  );

  const filterLabel = useCallback(
    () => getTransactionTypeFilterLabel(transactionType),
    [transactionType]
  );

  return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} />;
}
