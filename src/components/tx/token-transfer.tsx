import * as React from 'react';
import { Stack } from '@stacks/ui';

import { TokenTransfers } from '@components/token-transfer';
import { PageTop } from '@components/page';

import { TransactionType } from '@models/transaction.interface';
import { TransactionDetails } from '@components/transaction-details';
import { TokenTransferTransaction } from '@blockstack/stacks-blockchain-api-types';

interface TokenTransferPageProps {
  transaction: TokenTransferTransaction;
}

const TokenTransferPage = ({ transaction }: TokenTransferPageProps) => (
  <>
    <PageTop status={transaction.tx_status} type={[TransactionType.TOKEN_TRANSFER]} />
    <Stack spacing="extra-loose">
      <TransactionDetails transaction={transaction} hideContract />
      <TokenTransfers events={transaction.events} />
    </Stack>
  </>
);

export default TokenTransferPage;
