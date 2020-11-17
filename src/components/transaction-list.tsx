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
import { motion, AnimatePresence } from 'framer-motion';

import { TxItem } from '@components/transaction-item';
import { TxLink } from '@components/links';
import { border } from '@common/utils';
import { color } from '@components/color-modes';

import { Section } from '@components/section';
import { Toggle } from '@components/toggle';
import { atom, useRecoilState } from 'recoil';
import { useHover } from 'web-api-hooks';

import { FloatingHoverIndicator } from '@components/hover-indicator';

const Item: React.FC<
  { tx: MempoolTransaction | Transaction; isLast?: boolean; principal?: string } & BoxProps
> = React.memo(({ tx, isLast, principal, ...rest }) => {
  const [isHovered, bind] = useHover();
  return (
    <Box
      borderBottom={isLast ? 'unset' : '1px solid'}
      borderBottomColor="var(--colors-border)"
      position="relative"
      {...bind}
    >
      <FloatingHoverIndicator isHovered={isHovered} />
      <TxLink txid={tx.tx_id} {...rest}>
        <Box as="a" position="absolute" size="100%" />
      </TxLink>
      <TxItem isHovered={isHovered} as="span" tx={tx} principal={principal} key={tx.tx_id} />
    </Box>
  );
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VirtualList: React.FC<{
  items: (MempoolTransaction | Transaction)[];
  principal?: string;
}> = React.memo(({ items, principal }) => {
  return items.length ? (
    <Flex flexDirection="column">
      {items.map((tx: MempoolTransaction | Transaction, index: number) => (
        <Item principal={principal} key={index} tx={tx} isLast={index === items.length - 1} />
      ))}
    </Flex>
  ) : (
    <></>
  );
});

const EmptyMessage: React.FC = props => (
  <Grid px="base" py="64px" placeItems="center">
    <Caption>There are no transactions yet.'</Caption>
  </Grid>
);

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

const LoadMoreButton: React.FC<any> = React.memo(({ loadMore }) => (
  <Grid
    as="a"
    borderTop={border()}
    px="base"
    py="base"
    placeItems="center"
    bg={color('bg')}
    _hover={{ color: color('text-title') }}
    onClick={loadMore}
  >
    <Caption>Load more</Caption>
  </Grid>
));

const PendingList: React.FC<any> = React.memo(
  ({ pending, handleTogglePendingVisibility, pendingVisible }) =>
    pendingVisible ? (
      <Box borderBottom={border()} flexGrow={1}>
        <VirtualList items={pending} />
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
export const TransactionList: React.FC<
  {
    mempool?: MempoolTransactionListResponse['results'];
    transactions: TransactionResults['results'];
    // Boolean for homepage view
    recent?: boolean;
    isReachingEnd?: boolean;
    isLoadingMore?: boolean;
    principal?: string;
    loadMore?: () => void;
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
    ...rest
  }) => {
    const [filterState, setFilterState] = useRecoilState(txListFilterState);

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

    const pendingVisible = pending?.length > 0 && filterState.showPending;

    const hasTransactions = !!transactions?.length;

    const handleFilterViewToggle = () => {
      setFilterState(s => ({ ...s, showPending: !s.showPending }));
    };

    return (
      <Section
        title={recent ? 'Recent transactions' : 'Transactions'}
        topRight={
          !!pending?.length && (
            <>
              <Toggle
                size="small"
                label={`Show pending (${pending?.length})`}
                value={pendingVisible}
                onClick={handleFilterViewToggle}
              />
            </>
          )
        }
        {...rest}
      >
        <Box px="loose">
          <PendingList
            principal={principal}
            pending={pending}
            handleTogglePendingVisibility={handleTogglePendingVisibility}
            pendingVisible={pendingVisible}
          />
          {hasTransactions ? (
            <Box flexGrow={1}>
              <VirtualList principal={principal} items={transactions} />
            </Box>
          ) : (
            <Grid placeItems="center" px="base" py="extra-loose">
              <Caption>No transactions yet</Caption>
            </Grid>
          )}
          {hasTransactions && recent ? <ViewAllButton /> : null}
          {!isReachingEnd && loadMore ? (
            <LoadMoreButton isLoadingMore={isLoadingMore} loadMore={loadMore} />
          ) : null}
        </Box>
      </Section>
    );
  }
);
