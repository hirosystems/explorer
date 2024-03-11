import { FC, Fragment } from 'react';

import { AddressTransactionWithTransfersStxTransfers } from '@stacks/blockchain-api-client/src/generated/models';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { microToStacksFormatted } from '../../../common/utils/utils';
import { TransferListItem } from './TransferListItem';

interface StxTransfersProps {
  address: string;
  stxTransfers: AddressTransactionWithTransfersStxTransfers[];
}

export const StxTransfers: FC<StxTransfersProps> = ({ address, stxTransfers }) => (
  <Fragment>
    {stxTransfers.map((stxTransfer, i) => (
      <TransferListItem
        key={`stx-transfer-${i}`}
        title={'STX transfer'}
        sender={stxTransfer.sender}
        recipient={stxTransfer.recipient}
        amount={`${
          stxTransfer.amount ? microToStacksFormatted(stxTransfer.amount).toString() : '-'
        } STX`}
        isOriginator={address === stxTransfer.sender}
      />
    ))}
  </Fragment>
);
