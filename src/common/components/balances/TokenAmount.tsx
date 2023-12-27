'use client';

import React from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { useSuspenseFtMetadata } from '../../queries/useFtMetadata';
import { ftDecimals } from '../../utils/utils';

interface FtTokenAmountBaseProps {
  amount: string;
  contractId: string;
}
export function FtTokenAmountBase({ amount, contractId }: FtTokenAmountBaseProps) {
  const { data: tokenMetadata } = useSuspenseFtMetadata(contractId);
  return <>{ftDecimals(amount, tokenMetadata?.decimals || 0)}</>;
}

export function FtTokenAmount(props: FtTokenAmountBaseProps) {
  return (
    <ExplorerErrorBoundary>
      <FtTokenAmountBase {...props} />
    </ExplorerErrorBoundary>
  );
}

export function NftTokenAmount({ amount }: { amount: string }) {
  return <>{parseInt(amount).toLocaleString()}</>;
}
