import { StatusBadge } from '@/ui/Badge';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { getFunctionResultSuccessStatus } from './utils';

export function FunctionResultStatus({ tx }: { tx: ContractCallTransaction }) {
  const success = getFunctionResultSuccessStatus(tx);
  if (success == null) return null;
  return <StatusBadge successLabel="Success" failureLabel="Failure" success={success} />;
}
