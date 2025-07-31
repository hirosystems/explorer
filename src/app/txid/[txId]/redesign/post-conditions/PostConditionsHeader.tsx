import { TabsContentContainer } from '@/components/ui/tabs';
import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { getFunctionResultSuccessStatus } from './utils';

export function PostConditionsHeader() {
  return (
    <TabsContentContainer>
      {' '}
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
    </TabsContentContainer>
  );
}
