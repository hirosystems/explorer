import { AddressTransactionWithTransfersFtTransfers } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { useFtMetadata } from '@/appPages/common/queries/useFtMetadata';
import { useApi } from '@/common/api/client';
import { ftDecimals, getAssetNameParts } from '@/common/utils';
import { getTicker } from '@/components/tx-events';

import { TransferListItem } from './TransferListItem';

interface FtTransfersProps {
  address: string;
  ftTransfers: AddressTransactionWithTransfersFtTransfers[];
  tx: Transaction;
}

function TransferListItemWithMetaSymbol({
  ftTransfer,
  tx,
  sender,
  recipient,
  isOriginator,
}: {
  ftTransfer: AddressTransactionWithTransfersFtTransfers;
  tx: Transaction;
  sender?: string;
  recipient?: string;
  isOriginator: boolean;
}) {
  const api = useApi();
  const { asset, address, contract } = getAssetNameParts(ftTransfer.asset_identifier);
  const contractId = `${address}.${contract}`;
  const { data: ftMetadata } = useFtMetadata(api, { contractId }, { enabled: !!contractId });
  const symbol = ftMetadata?.symbol || getTicker(asset).toUpperCase();
  return (
    <TransferListItem
      tx={tx}
      title={`${symbol || 'Token'} transfer`}
      sender={sender}
      recipient={recipient}
      amount={`${
        ftTransfer.amount ? ftDecimals(ftTransfer.amount, ftMetadata?.decimals || 0) : '-'
      } ${symbol}`}
      isOriginator={isOriginator}
    />
  );
}

export function FtTransfers({ address, ftTransfers, tx }: FtTransfersProps) {
  return (
    <>
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
    </>
  );
}
