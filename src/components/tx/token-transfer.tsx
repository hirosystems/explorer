import * as React from 'react';
import { Stack } from '@stacks/ui';

import { TokenTransfers } from '@components/token-transfer';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { TokenTransferTxs, TxData } from '@common/types/tx';
import { Block } from '@blockstack/stacks-blockchain-api-types';

const TokenTransferPage = ({ transaction }: TxData<TokenTransferTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <Stack spacing="extra-loose">
      <TransactionDetails transaction={transaction} hideContract />
      {'events' in transaction && <TokenTransfers events={transaction.events} />}
    </Stack>
  </>
);

export default TokenTransferPage;
