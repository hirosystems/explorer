'use client';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { BtcAnchorBlockCardBase } from '../../../_components/BtcAnchorBlockCard';
import { ExplorerErrorBoundary } from '../../../_components/ErrorBoundary';
import { useTxBlock } from '../useTxBlock';

interface TxBtcAnchorBlockCardBaseProps {
  tx: Transaction | MempoolTransaction;
}

function TxBtcAnchorBlockCardBase({ tx }: TxBtcAnchorBlockCardBaseProps) {
  const { data: block } = useTxBlock(tx);
  return <BtcAnchorBlockCardBase block={block} />;
}

export function TxBtcAnchorBlockCard(props: TxBtcAnchorBlockCardBaseProps) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <TxBtcAnchorBlockCardBase {...props} />
    </ExplorerErrorBoundary>
  );
}
