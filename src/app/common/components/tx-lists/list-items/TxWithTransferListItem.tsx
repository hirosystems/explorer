import { useVerticallyStackedElementsBorderStyle } from '@/app/common/styles/border';
import { Text } from '@/ui/Text';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
} from '@/ui/components';
import React, { FC } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { FtTransfers } from './FtTransfers';
import { NftTransfers } from './NftTransfers';
import { StxTransfers } from './StxTransfers';
import { TxListItem } from './TxListItem';

interface TxWithTransferListItemProps {
  tx: AddressTransactionWithTransfers;
  address?: string;
}

export const TxWithTransferListItem: FC<TxWithTransferListItemProps> = ({
  tx: { tx, stx_transfers, ft_transfers, nft_transfers },
  address,
}) => {
  if (!address) return null;
  return (
    <AccordionItem border={'none'}>
      <Flex gap={'6px'}>
        <TxListItem tx={tx} key={`txs-list-item-${tx.tx_id}`} />
        <AccordionButton
          flexGrow={0}
          flexShrink={0}
          width={'30px'}
          ml={'auto'}
          p={0}
          justifyContent={'center'}
        >
          <AccordionIcon />
        </AccordionButton>
      </Flex>
      <AccordionPanel p={'0 30px 0 0'} css={useVerticallyStackedElementsBorderStyle}>
        {!stx_transfers?.length && !ft_transfers?.length && !nft_transfers?.length && (
          <Text fontSize={'14px'} p={'20px'} align={'center'}>
            No Transfers
          </Text>
        )}
        {stx_transfers && <StxTransfers address={address} stxTransfers={stx_transfers} tx={tx} />}
        {ft_transfers && <FtTransfers address={address} ftTransfers={ft_transfers} tx={tx} />}
        {nft_transfers && <NftTransfers address={address} nftTransfers={nft_transfers} tx={tx} />}
      </AccordionPanel>
    </AccordionItem>
  );
};
