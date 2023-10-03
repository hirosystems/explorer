import { ConfirmedTxsList } from '../default-lists/ConfirmedTxsList';
import { MempoolTxsList } from '../default-lists/MempoolTxsList';
import { TxListTabs } from './TxListTabs';

export function DefaultTxListTabs({ limit }: { limit?: number }) {
  return (
    <TxListTabs
      confirmedList={<ConfirmedTxsList limit={limit} />}
      mempoolList={<MempoolTxsList limit={limit} />}
    />
  );
}
