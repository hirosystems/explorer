'use client';

import { useBlockByHash } from '../../../common/queries/useBlockByHash';
import { BtcAnchorBlockCardBase } from '../../_components/BtcAnchorBlockCard';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { useParamsBlockHash } from './useParamsBlockHash';

function BlockBtcAnchorBlockCardBase() {
  const { data: block } = useBlockByHash(useParamsBlockHash(), {
    refetchOnWindowFocus: true,
  });
  return <BtcAnchorBlockCardBase block={block} />;
}

export function BlockBtcAnchorBlockCard() {
  return (
    <ExplorerErrorBoundary>
      <BlockBtcAnchorBlockCardBase />
    </ExplorerErrorBoundary>
  );
}
