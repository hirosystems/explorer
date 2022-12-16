import { ResultItemWrapper } from '@features/search/items/result-item-wrapper';
import React from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { FoundResult } from '@common/types/search-results';

import { TxLink } from '@components/links';
import { TxItem } from '@components/transaction-item';

interface TxResultItemProps {
  result: FoundResult;
}

export const TxResultItem: React.FC<TxResultItemProps> = ({ result }) => {
  const isTxid = result?.result.entity_type === 'tx_id';
  const isMempoolTxId = result?.result.entity_type === 'mempool_tx_id';
  const isContractId = result?.result.entity_type === 'contract_address';
  if (!result || (!isTxid && !isMempoolTxId && !isContractId)) return null;

  const transaction = result.result.metadata;

  if (!transaction) return null;

  return (
    <TxLink txid={transaction.tx_id}>
      <ResultItemWrapper p={0}>
        <TxItem tabIndex="0" tx={transaction} minimal px="loose" />
      </ResultItemWrapper>
    </TxLink>
  );
};
