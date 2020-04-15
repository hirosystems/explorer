import * as React from 'react';
import { Stack } from '@blockstack/ui';

import { PageTop } from '@components/page';
import { Rows } from '@components/rows';

import { TransactionType } from '@models/transaction.interface';
import { Statuses } from '@components/status';
import { TransactionDetails } from '@components/transaction-details';
import { CoinbaseTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

interface CoinbasePageProps {
  transaction: CoinbaseTransaction;
}

const CoinbasePage = ({ transaction }: CoinbasePageProps) => {
  return (
    <>
      <PageTop status={Statuses.SUCCESS} type={[TransactionType.COINBASE]} />
      <Stack shouldWrapChildren spacing="extra-loose">
        <TransactionDetails transaction={transaction} hideContract />
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
    </>
  );
};

export default CoinbasePage;
