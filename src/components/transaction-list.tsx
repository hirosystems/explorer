import { FilterPanel, FilteredMessage } from '@/components/filter-panel';
import { TxLink } from '@/components/links';
import { Section } from '@/components/section';
import { TxItem } from '@/components/transaction-item';
import { Box, BoxProps, Flex, FlexProps, Grid, Icon } from '@/ui/components';
import { Caption, Text } from '@/ui/typography';
import React from 'react';
import { TbFilter } from 'react-icons/tb';

import {
  MempoolTransaction,
  Transaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';

import { useFilterState } from '../app/common/hooks/use-filter-state';

const Item: React.FC<
  { tx: MempoolTransaction | Transaction; isLast?: boolean; principal?: string } & BoxProps
> = React.memo(({ tx, principal, ...rest }) => {
  return (
    <Flex {...rest}>
      <TxLink txId={tx.tx_id}>
        <Box as="a" position="absolute" size="100%" />
      </TxLink>
      <TxItem as="span" tx={tx} principal={principal} key={tx.tx_id} />
    </Flex>
  );
});

export const TxList: React.FC<{
  items: (MempoolTransaction | Transaction)[];
  principal?: string;
  limit?: number;
}> = React.memo(({ items, principal, limit }) => {
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
});

const Filter = () => {
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
};

export const TransactionList: React.FC<
  {
    transactions: TransactionResults['results'];
  } & FlexProps
> = React.memo(({ transactions, ...rest }) => {
  const { activeFilters } = useFilterState();
  const filteredTxs = transactions.filter(tx => activeFilters[tx.tx_type]);
  const hasTxs = !!transactions.length;
  const hasVisibleTxs = !!filteredTxs.length;

  return (
    <Section title={'Transactions'} topRight={Filter} {...rest}>
      <Box px="24px">
        {hasTxs && !hasVisibleTxs ? (
          <FilteredMessage />
        ) : hasVisibleTxs ? (
          <Box flexGrow={1}>
            <TxList items={filteredTxs} />
          </Box>
        ) : (
          <Grid placeItems="center" px="16px" py="32px">
            <Text color={'textCaption'} mt="32px">
              No transactions yet
            </Text>
          </Grid>
        )}
      </Box>
    </Section>
  );
});
