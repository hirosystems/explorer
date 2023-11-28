import { css } from '@emotion/react';
import React from 'react';

import { MempoolTxListItem } from '../../../common/components/tx-lists/list-items/MempoolTxListItem';
import { TxListItem } from '../../../common/components/tx-lists/list-items/TxListItem';
import { FoundResult } from '../../../common/types/search-results';
import { Box } from '../../../ui/Box';

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
      <Box px={'20px'}>
        <TxListItem
          tx={transaction}
          css={css`
            border: none;
          `}
        />
      </Box>
    );

  return (
    <Box px={'20px'}>
      <MempoolTxListItem
        tx={transaction}
        css={css`
          border: none;
        `}
      />
    </Box>
  );
};
