import { Tx } from '@/appPages/txid/Tx';
import { UnlockingScheduleModal } from '@/components/modals/unlocking-schedule';

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
      <Tx txId={txid} claritySyntax={claritySyntax} />
    </>
  );
}

export default TransactionPage;
