import * as React from 'react';
import { Stack } from '@blockstack/ui';

import { PageTop, PageWrapper } from '@components/page';
import { Rows } from '@components/rows';

import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';

const TransactionPage: React.FC = () => {
  return (
    <PageWrapper>
      <PageTop status={Statuses.SUCCESS} type={[TransactionType.COINBASE]} />
      <Stack shouldWrapChildren spacing="extra-loose">
        <TransactionDetails hideContract />
        <Rows
          items={[
            {
              label: {
                children: 'Scratch space',
              },
              children: 'Lorem ipsum dolor sit amet',
            },
          ]}
        />
      </Stack>
    </PageWrapper>
  );
};

export default TransactionPage;
