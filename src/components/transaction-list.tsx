import React, { memo } from 'react';
import { TbFilter } from 'react-icons/tb';
import {
  MempoolTransaction,
  Transaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';
import { FilteredMessage, FilterPanel } from '@/components/filter-panel';
import { TxLink } from '@/components/links';
import { Section } from '@/components/section';
import { TxItem } from '@/components/transaction-item';
import { Box, BoxProps, Flex, FlexProps, Grid, Icon } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';

import { useFilterState } from '../appPages/common/hooks/use-filter-state';

const Item = memo(
  ({
    tx,
    principal,
    ...rest
  }: { tx: MempoolTransaction | Transaction; isLast?: boolean; principal?: string } & BoxProps) => {
    return (
      <Flex {...rest}>
        <TxLink txId={tx.tx_id}>
          <Box as="a" position="absolute" size="100%" />
        </TxLink>
        <TxItem as="span" tx={tx} principal={principal} key={tx.tx_id} />
      </Flex>
    );
  }
);

export const TxList = memo(
  ({
    items,
    principal,
    limit,
  }: {
    items: (MempoolTransaction | Transaction)[];
    principal?: string;
    limit?: number;
  }) => {
    return items.length ? (
      <Flex flexDirection="column">
        {items.map((tx: MempoolTransaction | Transaction, index: number) =>
          limit ? (
            index < limit ? (
              <Item
                principal={principal}
                key={index}
                tx={tx}
                isLast={
                  limit
                    ? items.length < limit
                      ? index === items.length - 1
                      : index === limit - 1
                    : index === items.length - 1
                }
              />
            ) : null
          ) : (
            <Item principal={principal} key={index} tx={tx} isLast={index === items.length - 1} />
          )
        )}
      </Flex>
    ) : (
      <Flex flexGrow={1} alignItems="center" justifyContent="center">
        No transactions!
      </Flex>
    );
  }
);

function Filter() {
  const { toggleFilterVisibility } = useFilterState();
  return (
    <Box position="relative">
      <Caption
        display="flex"
        alignItems="center"
        _hover={{ cursor: 'pointer', color: 'textTitle' }}
        position="relative"
        onClick={toggleFilterVisibility}
      >
        <Icon as={TbFilter} mr="4px" color="currentColor" size="16px" strokeWidth={1.5} />
        Filter
      </Caption>
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel />
      </Box>
    </Box>
  );
}

export const TransactionList = memo(
  ({
    transactions,
    ...rest
  }: {
    transactions: TransactionResults['results'];
  } & FlexProps) => {
    const { activeFilters } = useFilterState();
    const filteredTxs = transactions.filter(tx => activeFilters[tx.tx_type]);
    const hasTxs = !!transactions.length;
    const hasVisibleTxs = !!filteredTxs.length;

    return (
      <Section title="Transactions" topRight={<Filter />} {...rest}>
        <Box px="24px">
          {hasTxs && !hasVisibleTxs ? (
            <FilteredMessage />
          ) : hasVisibleTxs ? (
            <Box flexGrow={1}>
              <TxList items={filteredTxs} />
            </Box>
          ) : (
            <Grid placeItems="center" px="16px" py="32px">
              <Text color="textCaption" mt="32px">
                No transactions yet
              </Text>
            </Grid>
          )}
        </Box>
      </Section>
    );
  }
);
