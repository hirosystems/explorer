'use client';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { useFtMetadata, useSuspenseFtMetadata } from '../../queries/useFtMetadata';
import { ftDecimals } from '../../utils/utils';

interface FtTokenAmountBaseProps {
  amount: string;
  contractId: string;
}
export function FtTokenAmountBase({ amount, contractId }: FtTokenAmountBaseProps) {
  const { data: tokenMetadata } = useFtMetadata(contractId);
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
