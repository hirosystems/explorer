import { FC, Fragment } from 'react';

import { AddressTransactionWithTransfersNftTransfers } from '@stacks/blockchain-api-client';
import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTicker } from '../../../app/txid/[txId]/Events';
import { getAssetNameParts } from '../../../common/utils/utils';
import { TransferListItem } from './TransferListItem';

interface NftTransfersProps {
  address: string;
  nftTransfers: AddressTransactionWithTransfersNftTransfers[];
  tx: Transaction;
}

export const NftTransfers: FC<NftTransfersProps> = ({ address, nftTransfers, tx }) => (
  <Fragment>
    {nftTransfers.map((nftTransfer, i) => {
      const collection = nftTransfer.asset_identifier.split('::')[1] || 'NFT';
      const { asset } = getAssetNameParts(nftTransfer.asset_identifier);
      const symbol = getTicker(asset).toUpperCase();
      return (
        <TransferListItem
          key={`nft-transfer-${i}`}
          title={`${collection} transfer`}
          sender={nftTransfer.sender}
          recipient={nftTransfer.recipient}
          amount={`1 ${symbol}`}
          isOriginator={address === nftTransfer.sender}
        />
      );
    })}
  </Fragment>
);
