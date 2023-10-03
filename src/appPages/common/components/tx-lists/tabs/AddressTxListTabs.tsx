import { AddressConfirmedTxsList } from '../address-lists/AddressConfirmedTxsList';
import { AddressMempoolTxsList } from '../address-lists/AddressMempoolTxsList';
import { TxListTabs } from './TxListTabs';

export function AddressTxListTabs({ address }: { address: string }) {
  return (
    <TxListTabs
      confirmedList={<AddressConfirmedTxsList address={address} />}
      mempoolList={<AddressMempoolTxsList address={address} />}
    />
  );
}
