import { FC, Fragment } from 'react';

import { AddressTransactionWithTransfersFtTransfers } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTicker } from '../../../app/txid/[txId]/Events';
import { useFtMetadata } from '../../../common/queries/useFtMetadata';
import { ftDecimals, getAssetNameParts } from '../../../common/utils/utils';
import { TransferListItem } from './TransferListItem';

interface FtTransfersProps {
  address: string;
  ftTransfers: AddressTransactionWithTransfersFtTransfers[];
  tx: Transaction;
}

const TransferListItemWithMetaSymbol: FC<{
  ftTransfer: AddressTransactionWithTransfersFtTransfers;
  tx: Transaction;
  sender?: string;
  recipient?: string;
  isOriginator: boolean;
}> = ({ ftTransfer, tx, sender, recipient, isOriginator }) => {
  const { asset, address, contract } = getAssetNameParts(ftTransfer.asset_identifier);
  const contractId = `${address}.${contract}`;
  const { data: ftMetadata } = useFtMetadata(contractId);
  const symbol = ftMetadata?.symbol || getTicker(asset).toUpperCase();
  return (
    <TransferListItem
      title={`${symbol || 'Token'} transfer`}
      sender={sender}
      recipient={recipient}
      amount={`${
        ftTransfer.amount ? ftDecimals(ftTransfer.amount, ftMetadata?.decimals || 0) : '-'
      } ${symbol}`}
      isOriginator={isOriginator}
    />
  );
};

export const FtTransfers: FC<FtTransfersProps> = ({ address, ftTransfers, tx }) => (
  <Fragment>
    {ftTransfers.map((ftTransfer, i) => {
      return (
        <TransferListItemWithMetaSymbol
          ftTransfer={ftTransfer}
          key={`ft-transfer-${i}`}
          tx={tx}
          sender={ftTransfer.sender}
          recipient={ftTransfer.recipient}
          isOriginator={address === ftTransfer.sender}
        />
      );
    })}
  </Fragment>
);
