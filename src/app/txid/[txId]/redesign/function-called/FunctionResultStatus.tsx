import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { getFunctionResultSuccessStatus } from './utils';

export function FunctionResultStatus({ tx }: { tx: ContractCallTransaction }) {
  const success = getFunctionResultSuccessStatus(tx);
  if (success == null) return null;
  return (
    <DefaultBadge
      icon={
        <DefaultBadgeIcon
          icon={success ? <CheckCircle /> : <XCircle />}
          color={success ? 'feedback.green-500' : 'iconError'}
          bg={success ? 'transactionStatus.confirmed' : 'transactionStatuses.failed'}
        />
      }
      label={
        success ? <DefaultBadgeLabel label="Success" /> : <DefaultBadgeLabel label="Failure" />
      }
      textStyle="text-medium-sm"
      bg={success ? 'transactionStatus.confirmed' : 'transactionStatuses.failed'}
      border="none"
    />
  );
}
