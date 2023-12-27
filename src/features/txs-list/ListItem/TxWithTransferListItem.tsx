import pluralize from 'pluralize';
import React, { FC, memo } from 'react';

import { AddressTransactionWithTransfers, Transaction } from '@stacks/stacks-blockchain-api-types';

import { AddressArea } from '../../../common/components/transaction-item';
import { AccordionButton } from '../../../ui/AccordionButton';
import { AccordionIcon } from '../../../ui/AccordionIcon';
import { AccordionItem } from '../../../ui/AccordionItem';
import { AccordionPanel } from '../../../ui/AccordionPanel';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Stack } from '../../../ui/Stack';
import { Caption, Text } from '../../../ui/typography';
import { getTransactionTypeLabel } from '../utils';
import { FtTransfers } from './FtTransfers';
import { NftTransfers } from './NftTransfers';
import { StxTransfers } from './StxTransfers';
import { TxListItem } from './TxListItem';

interface TxWithTransferListItemProps {
  tx: AddressTransactionWithTransfers;
  address?: string;
}

const LeftSubtitle: FC<{ tx: Transaction; transfersCount: number }> = memo(
  ({ tx, transfersCount }) => (
    <HStack
      color={'secondaryText'}
      as="span"
      gap={1}
      alignItems="center"
      flexWrap="wrap"
      divider={<Caption>∙</Caption>}
    >
      <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
      <Caption fontWeight="semibold">
        {transfersCount} {pluralize('transfer', transfersCount)}
      </Caption>
      <AddressArea tx={tx} />
    </HStack>
  )
);

export const TxWithTransferListItem: FC<TxWithTransferListItemProps> = ({
  tx: { tx, stx_transfers, ft_transfers, nft_transfers },
  address,
}) => {
  if (!address) return null;
  return (
    <AccordionItem border={'none'} borderBottom={'1px'} _last={{ borderBottom: 'unset' }}>
      <Flex gap={1.5}>
        <TxListItem
          tx={tx}
          key={`txs-list-item-${tx.tx_id}`}
          leftSubtitle={
            <LeftSubtitle
              tx={tx}
              transfersCount={
                (stx_transfers?.length || 0) +
                (ft_transfers?.length || 0) +
                (nft_transfers?.length || 0)
              }
            />
          }
        />
        <AccordionButton
          flexGrow={0}
          flexShrink={0}
          width={8}
          ml={'auto'}
          p={0}
          justifyContent={'center'}
        >
          <AccordionIcon />
        </AccordionButton>
      </Flex>
      <AccordionPanel p={0}>
        {!stx_transfers?.length && !ft_transfers?.length && !nft_transfers?.length && (
          <Text fontSize={'sm'} p={5} align={'center'}>
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
