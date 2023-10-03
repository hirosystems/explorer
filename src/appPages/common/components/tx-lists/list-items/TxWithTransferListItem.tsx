import pluralize from 'pluralize';
import React, { memo } from 'react';
import { AddressTransactionWithTransfers, Transaction } from '@stacks/stacks-blockchain-api-types';
import { getTransactionTypeLabel } from '@/appPages/common/components/tx-lists/utils/tx';
import { useVerticallyStackedElementsBorderStyle } from '@/appPages/common/styles/border';
import { AddressArea } from '@/components/transaction-item';
import { Text } from '@/ui/Text';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Stack,
} from '@/ui/components';
import { Caption } from '@/ui/typography';

import { FtTransfers } from './FtTransfers';
import { NftTransfers } from './NftTransfers';
import { StxTransfers } from './StxTransfers';
import { TxListItem } from './TxListItem';

interface TxWithTransferListItemProps {
  tx: AddressTransactionWithTransfers;
  address?: string;
}

const LeftSubtitle = memo(({ tx, transfersCount }: { tx: Transaction; transfersCount: number }) => {
  return (
    <Stack
      as="span"
      isInline
      gap="4px"
      alignItems="center"
      flexWrap="wrap"
      divider={<Caption>∙</Caption>}
    >
      <Caption fontWeight="bold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
      <Caption fontWeight="bold">
        {transfersCount} {pluralize('transfer', transfersCount)}
      </Caption>
      <AddressArea tx={tx} />
    </Stack>
  );
});

export function TxWithTransferListItem({
  tx: { tx, stx_transfers, ft_transfers, nft_transfers },
  address,
}: TxWithTransferListItemProps) {
  if (!address) return null;
  return (
    <AccordionItem border="none">
      <Flex gap="6px">
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
          width="30px"
          ml="auto"
          p={0}
          justifyContent="center"
        >
          <AccordionIcon />
        </AccordionButton>
      </Flex>
      <AccordionPanel p="0 30px 0 0" css={useVerticallyStackedElementsBorderStyle}>
        {!stx_transfers?.length && !ft_transfers?.length && !nft_transfers?.length && (
          <Text fontSize="14px" p="20px" align="center">
            No Transfers
          </Text>
        )}
        {stx_transfers && <StxTransfers address={address} stxTransfers={stx_transfers} tx={tx} />}
        {ft_transfers && <FtTransfers address={address} ftTransfers={ft_transfers} tx={tx} />}
        {nft_transfers && <NftTransfers address={address} nftTransfers={nft_transfers} tx={tx} />}
      </AccordionPanel>
    </AccordionItem>
  );
}
