'use client';

import React from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { Box } from '../../../ui/Box';
import { Text } from '../../../ui/Text';
import { useSuspenseFtMetadata } from '../../queries/useFtMetadata';
import { ftDecimals } from '../../utils/utils';

interface FtTokenAmountBaseProps {
  amount: string;
  contractId: string;
}
export function FtTokenAmountBase({ amount, contractId }: FtTokenAmountBaseProps) {
  const { data: tokenMetadata } = useSuspenseFtMetadata(contractId);
  return (
    <Text color={'textBody'} textAlign="right">
      {ftDecimals(amount, tokenMetadata?.decimals || 0)}
    </Text>
  );
}

export function FtTokenAmount(props: FtTokenAmountBaseProps) {
  return (
    <ExplorerErrorBoundary>
      <FtTokenAmountBase {...props} />
    </ExplorerErrorBoundary>
  );
}

export function NftTokenAmount({ amount }: { amount: string }) {
  return (
    <Text color={'textBody'} textAlign="right">
      {parseInt(amount).toLocaleString()}
    </Text>
  );
}
