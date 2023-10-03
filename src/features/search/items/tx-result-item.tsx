import { css } from '@emotion/react';
import React from 'react';
import { MempoolTxListItem } from '@/appPages/common/components/tx-lists/list-items/MempoolTxListItem';
import { TxListItem } from '@/appPages/common/components/tx-lists/list-items/TxListItem';
import { FoundResult, SearchResultType } from '@/common/types/search-results';
import { Box } from '@/ui/components';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

interface TxResultItemProps {
  result: FoundResult;
}

export function TxResultItem({ result }: TxResultItemProps) {
  const isTxId = result?.result.entity_type === SearchResultType.TxId;
  const isMempoolTxId = result?.result.entity_type === SearchResultType.MempoolTxId;
  const isContractId = result?.result.entity_type === SearchResultType.ContractAddress;
  if (!result || (!isTxId && !isMempoolTxId && !isContractId)) return null;

  const transaction = result.result.metadata as unknown as Transaction | MempoolTransaction; // missing API type

  if (!transaction) return null;

  if ('block_height' in transaction)
    return (
      <Box px="20px">
        <TxListItem
          tx={transaction}
          css={css`
            border: none;
          `}
        />
      </Box>
    );

  return (
    <Box px="20px">
      <MempoolTxListItem
        tx={transaction}
        css={css`
          border: none;
        `}
      />
    </Box>
  );
}
