import { Box, BoxProps, Flex, FlexProps, Grid, Stack, transition } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import {
  MempoolTransaction,
  MempoolTransactionListResponse,
  Transaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import NextLink from 'next/link';
import React from 'react';

import { TxItem } from '@components/transaction-item';
import { TxLink } from '@components/links';
import { border } from '@common/utils';
import { color } from '@components/color-modes';

import { Section } from '@components/section';
import { Toggle } from '@components/toggle';
import { atom, useRecoilState } from 'recoil';

import { Pending } from '@components/status';
import { HoverableItem } from '@components/hoverable';
import { CaptionAction } from '@components/caption-action';
import { IconFilter } from '@tabler/icons';
import { FilteredMessage, FilterPanel } from '@components/sandbox/filter-panel';
import { useFilterState } from '@common/hooks/use-filter-state';

const Item: React.FC<
  { tx: MempoolTransaction | Transaction; isLast?: boolean; principal?: string } & BoxProps
> = React.memo(({ tx, isLast, principal, ...rest }) => {
  return (
    <HoverableItem isLast={isLast}>
      <TxLink txid={tx.tx_id} {...rest}>
        <Box as="a" position="absolute" size="100%" />
      </TxLink>
      <TxItem as="span" tx={tx} principal={principal} key={tx.tx_id} />
    </HoverableItem>
  );
});

const TxList: React.FC<{
  items: (MempoolTransaction | Transaction)[];
  principal?: string;
  limit?: number;
}> = React.memo(({ items, principal, limit }) => {
  return (
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
  );
});

const ViewAllButton: React.FC = React.memo(props => (
  <NextLink href="/transactions" passHref>
    <Grid
      as="a"
      borderTop={border()}
      px="base"
      py="base"
      placeItems="center"
      bg={color('bg')}
      color={color('text-caption')}
      _hover={{ color: color('text-title') }}
    >
      <Caption color="currentColor">View all transactions</Caption>
    </Grid>
  </NextLink>
));

const LoadMoreButton: React.FC<any> = React.memo(({ loadMore, isLoadingMore }) => (
  <Grid
    as="a"
    borderTop={border()}
    px="base"
    py="base"
    placeItems="center"
    color={color('text-caption')}
    bg={color('bg')}
    _hover={{ color: color('text-title'), cursor: 'pointer' }}
    onClick={loadMore}
  >
    {isLoadingMore ? (
      <Flex>
        <Pending size="16px" />
        <Caption color="currentColor" ml="tight">
          Loading...
        </Caption>
      </Flex>
    ) : (
      <Caption color="currentColor">Load more</Caption>
    )}
  </Grid>
));

const PendingList: React.FC<any> = React.memo(
  ({ pending, handleTogglePendingVisibility, pendingVisible }) =>
    pendingVisible ? (
      <Box borderBottom={border()} flexGrow={1}>
        <TxList items={pending} />
      </Box>
    ) : null
);

const txListFilterState = atom({
  key: 'tx-list.filters',
  default: {
    visible: false,
    showPending: true,
  },
});

const Filter = () => {
  const { handleToggleFilterPanelVisibility } = useFilterState('txList');
  return (
    <Box position="relative" zIndex={99999999}>
      <CaptionAction
        position="relative"
        zIndex={999}
        onClick={handleToggleFilterPanelVisibility}
        label="Filter"
        icon={IconFilter}
      />
      <Box pointerEvents="none" top={0} right="-32px" position="absolute" size="500px">
        <FilterPanel
          bg={color('bg')}
          hideBackdrop
          filterKey="txList"
          showBorder
          pointerEvents="all"
        />
      </Box>
    </Box>
  );
};

export const TransactionList: React.FC<
  {
    mempool?: MempoolTransactionListResponse['results'];
    transactions: TransactionResults['results'];
    // Boolean for homepage view
    recent?: boolean;
    isReachingEnd?: boolean;
    isLoadingMore?: boolean;
    hideFilter?: boolean;
    principal?: string;
    loadMore?: () => void;
    limit?: number;
  } & FlexProps
> = React.memo(
  ({
    mempool = [],
    transactions,
    recent,
    loadMore,
    isReachingEnd,
    principal,
    isLoadingMore,
    hideFilter = true,
    limit,
    ...rest
  }) => {
    const [pendingVisibility, setPendingVisibility] = React.useState<'visible' | 'hidden'>(
      'visible'
    );

    const handleTogglePendingVisibility = React.useCallback(() => {
      setPendingVisibility(s => (s === 'visible' ? 'hidden' : 'visible'));
    }, [setPendingVisibility]);

    const pending: MempoolTransactionListResponse['results'] = mempool.filter(tx => {
      const now = new Date().getTime();
      const pendingTime = tx.receipt_time * 1000;
      if (now - pendingTime <= 1000 * 60 * 60) {
        return true;
      }
      return false;
    });

    const { showPending, showFailed, handleToggleFilterPanelVisibility, types } = useFilterState(
      'txList'
    );

    const items = [...pending, ...transactions];

    const filteredTxs = hideFilter
      ? items
      : items
          ?.filter(tx => types.find(type => type === tx.tx_type))
          ?.filter(tx => (!showFailed ? tx.tx_status === 'success' : true))
          ?.filter(tx => (!showPending ? tx.tx_status !== 'pending' : true));

    const hasTransactions = !!filteredTxs?.length;

    const hasNoVisibleTxs = !hasTransactions && items.length > 0;

    return (
      <Section
        title={recent ? 'Recent transactions' : 'Transactions'}
        topRight={
          <Flex>
            {hideFilter && !!pending?.length && (
              <>
                <Toggle
                  size="small"
                  label={`Show pending (${pending?.length})`}
                  value={showPending}
                  onClick={handleToggleFilterPanelVisibility}
                />
              </>
            )}
            {!hideFilter ? <Filter /> : null}
          </Flex>
        }
        {...rest}
      >
        <Box px="loose">
          {hasNoVisibleTxs ? (
            <FilteredMessage minHeight="500px" filterKey={'txList'} />
          ) : hasTransactions ? (
            <Box flexGrow={1}>
              <TxList principal={principal} items={filteredTxs} />
            </Box>
          ) : (
            <Grid placeItems="center" px="base" py="extra-loose">
              <Caption>No transactions yet</Caption>
            </Grid>
          )}
          {!hasNoVisibleTxs && hasTransactions && recent ? <ViewAllButton /> : null}
          {!hasNoVisibleTxs && !isReachingEnd && loadMore ? (
            <LoadMoreButton isLoadingMore={isLoadingMore} loadMore={loadMore} />
          ) : null}
        </Box>
      </Section>
    );
  }
);
