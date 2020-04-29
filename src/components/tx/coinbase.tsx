import * as React from 'react';
import { Stack } from '@blockstack/ui';

import { PageTop } from '@components/page';
import { Rows } from '@components/rows';

import { TransactionType } from '@models/transaction.interface';
import { TransactionDetails } from '@components/transaction-details';
import { CoinbaseTransaction } from '@blockstack/stacks-blockchain-sidecar-types';

interface CoinbasePageProps {
  transaction: CoinbaseTransaction;
}

const CoinbasePage = ({ transaction }: CoinbasePageProps) => (
  <>
    <PageTop status={transaction.tx_status} type={[TransactionType.COINBASE]} />
    <Stack spacing="extra-loose">
      <TransactionDetails transaction={transaction} hideContract />
      {transaction.coinbase_payload.data ? (
        <Rows
          noTopBorder
          items={[
            {
              label: {
                children: 'Scratch space',
              },
              children: transaction.coinbase_payload.data,
            },
          ]}
        />
      ) : null}
    </Stack>
  </>
);

export default CoinbasePage;
