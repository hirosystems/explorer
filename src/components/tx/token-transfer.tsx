import * as React from 'react';
import { Stack } from '@stacks/ui';

import { Events } from '@components/tx-events';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { TokenTransferTxs, TxData } from '@common/types/tx';
import { Block } from '@blockstack/stacks-blockchain-api-types';

const TokenTransferPage = ({ transaction }: TxData<TokenTransferTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <Stack spacing="extra-loose">
      <TransactionDetails transaction={transaction} hideContract />
      {'events' in transaction && <Events events={transaction.events} />}
    </Stack>
  </>
);

export default TokenTransferPage;
