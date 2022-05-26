import { Box, BoxProps, color, Flex, FlexProps, Grid } from '@stacks/ui';
import { Text } from '@components/typography';
import {
  MempoolTransaction,
  Transaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';
import React from 'react';
import { TxItem } from '@components/transaction-item';
import { TxLink } from '@components/links';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { CaptionAction } from '@components/caption-action';
import { IconFilter } from '@tabler/icons';
import { FilteredMessage, FilterPanel } from '@components/filter-panel';
import { useFilterState } from '@common/hooks/use-filter-state';
import { TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';

const Item: React.FC<
  { tx: MempoolTransaction | Transaction; isLast?: boolean; principal?: string } & BoxProps
> = React.memo(({ tx, principal, ...rest }) => {
  return (
    <HoverableItem>
      <TxLink txid={tx.tx_id} {...rest}>
        <Box as="a" position="absolute" size="100%" />
      </TxLink>
      <TxItem as="span" tx={tx} principal={principal} key={tx.tx_id} />
    </HoverableItem>
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
  const { toggleFilterVisibility } = useFilterState(TxFilterTypes.BlocksPageTxFilter);
  return (
    <Box position="relative" zIndex={99999999}>
      <CaptionAction
        position="relative"
        zIndex={999}
        onClick={toggleFilterVisibility}
        label="Filter"
        icon={IconFilter}
      />
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel
          bg={color('bg')}
          filterKey={TxFilterTypes.BlocksPageTxFilter}
          showBorder
          pointerEvents="all"
        />
      </Box>
    </Box>
  );
};

export const TransactionList: React.FC<
  {
    transactions: TransactionResults['results'];
  } & FlexProps
> = React.memo(({ transactions, ...rest }) => {
  const { activeFilters } = useFilterState(TxFilterTypes.BlocksPageTxFilter);
  const filteredTxs = transactions.filter(tx => activeFilters[tx.tx_type]);
  const hasTxs = !!transactions.length;
  const hasVisibleTxs = !!filteredTxs.length;

  return (
    <Section title={'Transactions'} topRight={Filter} {...rest}>
      <Box px="loose">
        {hasTxs && !hasVisibleTxs ? (
          <FilteredMessage filterType={TxFilterTypes.TransactionsPageTxFilter} />
        ) : hasVisibleTxs ? (
          <Box flexGrow={1}>
            <TxList items={filteredTxs} />
          </Box>
        ) : (
          <Grid placeItems="center" px="base" py="extra-loose">
            <Box as="img" src="/no-txs.svg" alt="No transactions yet" />
            <Text color={color('text-caption')} mt="extra-loose">
              No transactions yet
            </Text>
          </Grid>
        )}
      </Box>
    </Section>
  );
});
