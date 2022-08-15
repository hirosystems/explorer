import type {
  MempoolTransactionsListResponse,
  TransactionsListResponse,
} from '@store/transactions';
import { useFilterState } from '@common/hooks/use-filter-state';
import { TxsListItem } from './TxsListItem';
import { MempoolTxsListItem } from './MempoolTxsListItem';
import { FC, Fragment, memo, useMemo } from 'react';
import { UseInfiniteQueryResult } from 'react-query';
import { SectionFooterAction } from '@components/section-footer-button';
import { FilteredMessage } from '@components/filter-panel';
import { Text } from '@components/typography';
import { Grid, Box, color } from '@stacks/ui';

interface TxsListCommonProps {
  showFooter?: boolean;
  infinite?: boolean;
  limit?: number;
}

interface TxsListProps extends TxsListCommonProps {
  response: UseInfiniteQueryResult<TransactionsListResponse>;
}

export const TxsList: FC<TxsListProps> = memo(({ response, showFooter, infinite, limit }) => {
  console.log('[debug] rendering TxsList');
  const { activeFilters } = useFilterState();

  const txs = useMemo(() => response.data?.pages.map(page => page.results).flat(), [response]);
  const filteredTxs = useMemo(
    () => txs?.filter(tx => activeFilters[tx.tx_type]).slice(0, infinite ? undefined : limit),
    [txs, activeFilters]
  );

  const hasTxs = !!txs?.length;
  const hasVisibleTxs = !!filteredTxs?.length;

  return (
    <Fragment>
      {hasTxs && !hasVisibleTxs ? (
        <FilteredMessage />
      ) : hasVisibleTxs ? (
        filteredTxs?.map(tx => <TxsListItem tx={tx} key={`txs-list-item-${tx.tx_id}`} />)
      ) : (
        <Grid placeItems="center" px="base" py="extra-loose">
          <Box as="img" src="/no-txs.svg" alt="No transactions yet" />
          <Text color={color('text-caption')} mt="extra-loose">
            No transactions
          </Text>
        </Grid>
      )}
      {showFooter && (
        <SectionFooterAction
          path="transactions"
          isLoading={response.isFetchingNextPage}
          onClick={response.fetchNextPage}
          showLoadMoreButton={infinite}
          hasNextPage={response.hasNextPage}
        />
      )}
    </Fragment>
  );
});

interface MempoolTxsListProps extends TxsListCommonProps {
  response: UseInfiniteQueryResult<MempoolTransactionsListResponse>;
}

export const MempoolTxsList: FC<MempoolTxsListProps> = memo(
  ({ response, showFooter, infinite, limit }) => {
    console.log('[debug] rendering MempoolTxsList');
    const txs = useMemo(
      () =>
        response.data?.pages
          .map(page => page.results)
          .flat()
          .slice(0, infinite ? undefined : limit),
      [response]
    );
    return (
      <Fragment>
        {txs?.map(tx => (
          <MempoolTxsListItem tx={tx} key={`mempool-txs-list-item-${tx.tx_id}`} />
        ))}
        {showFooter && (
          <SectionFooterAction
            path="transactions"
            isLoading={response.isFetchingNextPage}
            onClick={response.fetchNextPage}
            showLoadMoreButton={infinite}
            hasNextPage={response.hasNextPage}
          />
        )}
      </Fragment>
    );
  }
);
