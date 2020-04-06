import * as React from 'react';
import { Stack } from '@blockstack/ui';

import { TokenTransfers } from '@components/token-transfer';
import { PageTop, PageWrapper } from '@components/page';

import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';

const TransactionPage: React.FC = () => {
  return (
    <PageWrapper>
      <PageTop status={Statuses.SUCCESS} type={[TransactionType.TOKEN_TRANSFER]} />
      <Stack>
        <TransactionDetails />
        <TokenTransfers />
      </Stack>
    </PageWrapper>
  );
};

export default TransactionPage;
