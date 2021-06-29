import React from 'react';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useInfiniteFetch } from '@common/hooks/use-fetch-blocks';

export const usePendingTxs = (
  principal: string,
  options?: { suspense?: boolean }
): [pendingTransactions: MempoolTransaction[], refresh: () => void] => {
  const { data, refresh } = useInfiniteFetch<MempoolTransaction>({
    initialData: [],
    type: 'tx',
    limit: 25,
    pending: true,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
    suspense: options?.suspense,
  });

  const pendingTransactions = data
    ? data?.filter(
        (tx: MempoolTransaction) =>
          ((tx.tx_type === 'contract_call' || tx.tx_type === 'smart_contract') &&
            tx.sender_address === principal) ||
          (tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === principal)
      )
    : [];

  return [pendingTransactions, refresh];
};
