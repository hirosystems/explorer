import { TransactionPageComponent } from '@/app/txid/TransactionPageComponent';
import { UnlockingScheduleModal } from '@/components/modals/unlocking-schedule';
import * as React from 'react';

function TransactionPage({
  params: { txid },
  claritySyntax,
}: {
  params: { txid: string };
  claritySyntax: Record<string, any>;
}) {
  return (
    <>
      <UnlockingScheduleModal />
      <TransactionPageComponent txId={txid} claritySyntax={claritySyntax} />
    </>
  );
}

export default TransactionPage;
