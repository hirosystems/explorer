import { AddressTransactionWithTransfersStxTransfers } from '@stacks/blockchain-api-client/src/generated/models';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { microToStacks } from '@/common/utils';

import { TransferListItem } from './TransferListItem';

interface StxTransfersProps {
  address: string;
  stxTransfers: AddressTransactionWithTransfersStxTransfers[];
  tx: Transaction;
}

export function StxTransfers({ address, stxTransfers, tx }: StxTransfersProps) {
  return (
    <>
      {stxTransfers.map((stxTransfer, i) => (
        <TransferListItem
          key={`stx-transfer-${i}`}
          tx={tx}
          title="STX transfer"
          sender={stxTransfer.sender}
          recipient={stxTransfer.recipient}
          amount={`${stxTransfer.amount ? microToStacks(stxTransfer.amount).toString() : '-'} STX`}
          isOriginator={address === stxTransfer.sender}
        />
      ))}
    </>
  );
}
