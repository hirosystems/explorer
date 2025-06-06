import React from 'react';

import { FoundResult } from '../../../common/types/search-results';
import { MempoolTxListItem } from '../../txs-list/ListItem/MempoolTxListItem';
import { TxListItem } from '../../txs-list/ListItem/TxListItem';

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

  if ('block_height' in transaction)
    return (
      <TxListItem
        tx={transaction}
        css={{
          border: 'none',
        }}
        className={`search-bar-result-1`}
      />
    );

  return (
    <MempoolTxListItem
      tx={transaction}
      css={{
        border: 'none',
      }}
      className={`search-bar-result-1`}
    />
  );
};
