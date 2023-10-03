import { Fragment } from 'react';

import { AddressTransactionWithTransfersNftTransfers } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { getTicker } from '@/components/tx-events';
import { getAssetNameParts } from '@/common/utils';

import { TransferListItem } from './TransferListItem';

interface NftTransfersProps {
  address: string;
  nftTransfers: AddressTransactionWithTransfersNftTransfers[];
  tx: Transaction;
}

export function NftTransfers({ address, nftTransfers, tx }: NftTransfersProps) {
  return (
    <>
      {nftTransfers.map((nftTransfer, i) => {
        const collection = nftTransfer.asset_identifier.split('::')[1] || 'NFT';
        const { asset } = getAssetNameParts(nftTransfer.asset_identifier);
        const symbol = getTicker(asset).toUpperCase();
        return (
          <TransferListItem
            key={`nft-transfer-${i}`}
            tx={tx}
            title={`${collection} transfer`}
            sender={nftTransfer.sender}
            recipient={nftTransfer.recipient}
            amount={`1 ${symbol}`}
            isOriginator={address === nftTransfer.sender}
          />
        );
      })}
    </>
  );
}
