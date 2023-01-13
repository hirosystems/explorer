import { useTokenMetadata } from '@/common/hooks/use-token-metadata';
import { ftDecimals, getAssetNameParts } from '@/common/utils';
import { getTicker } from '@/components/tx-events';
import { FC, Fragment } from 'react';

import { AddressTransactionWithTransfersFtTransfers } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransferListItem } from './TransferListItem';

interface FtTransfersProps {
  address: string;
  ftTransfers: AddressTransactionWithTransfersFtTransfers[];
  tx: Transaction;
}

export const FtTransfers: FC<FtTransfersProps> = ({ address, ftTransfers, tx }) => (
  <Fragment>
    {ftTransfers.map((ftTransfer, i) => {
      const token = ftTransfer.asset_identifier.split('::')[0];
      const { asset } = getAssetNameParts(ftTransfer.asset_identifier);
      const {
        ftMetadata: { data: ftMetadata },
      } = useTokenMetadata(token, 'fungible_tokens');
      const symbol = ftMetadata?.symbol || getTicker(asset).toUpperCase();
      return (
        <TransferListItem
          key={`ft-transfer-${i}`}
          tx={tx}
          title={`${symbol || 'Token'} transfer`}
          sender={ftTransfer.sender}
          recipient={ftTransfer.recipient}
          amount={`${
            ftTransfer.amount ? ftDecimals(ftTransfer.amount, ftMetadata?.decimals || 0) : '-'
          } ${symbol}`}
          isOriginator={address === ftTransfer.sender}
        />
      );
    })}
  </Fragment>
);
