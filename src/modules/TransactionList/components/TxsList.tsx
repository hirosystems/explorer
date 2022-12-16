import { FC, Fragment, memo, useMemo } from 'react';
import { UseInfiniteQueryResult } from 'react-query';

import {
  AddressTransactionWithTransfersFtTransfers,
  AddressTransactionWithTransfersNftTransfers,
  AddressTransactionsWithTransfersListResponse,
} from '@stacks/blockchain-api-client';
import { AddressTransactionWithTransfersStxTransfers } from '@stacks/blockchain-api-client/src/generated/models';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Grid, color } from '@stacks/ui';

import { useFilterState } from '@common/hooks/use-filter-state';
import { useTokenMetadata } from '@common/hooks/use-token-metadata';
import { ApiResponseWithResultsOffset } from '@common/types/api';
import { ftDecimals, getAssetNameParts, microToStacks } from '@common/utils';

import { FilteredMessage } from '@components/filter-panel';
import { SectionFooterAction } from '@components/section-footer-button';
import { getTicker } from '@components/tx-events';
import { Text } from '@components/typography';

import { MempoolTxsListItem } from './MempoolTxsListItem';
import { TransferListItem, TxsListItem } from './TxsListItem';

interface TxsListCommonProps {
  showFooter?: boolean;
  infinite?: boolean;
  limit?: number;
}

interface TxsListProps extends TxsListCommonProps {
  response: UseInfiniteQueryResult<ApiResponseWithResultsOffset<Transaction>>;
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

interface TxsListWithTransfersProps extends TxsListCommonProps {
  address: string;
  response: UseInfiniteQueryResult<AddressTransactionsWithTransfersListResponse>;
}

interface StxTransfersProps {
  address: string;
  stxTransfers: AddressTransactionWithTransfersStxTransfers[];
  tx: Transaction;
}

const StxTransfers: FC<StxTransfersProps> = ({ address, stxTransfers, tx }) => (
  <Fragment>
    {stxTransfers.map(stxTransfer => (
      <TransferListItem
        tx={tx}
        title={'STX transfer'}
        sender={stxTransfer.sender}
        recipient={stxTransfer.recipient}
        amount={`${stxTransfer.amount ? microToStacks(stxTransfer.amount).toString() : '-'} STX`}
        isOriginator={address === stxTransfer.sender}
      />
    ))}
  </Fragment>
);

interface FtTransfersProps {
  address: string;
  ftTransfers: AddressTransactionWithTransfersFtTransfers[];
  tx: Transaction;
}

const FtTransfers: FC<FtTransfersProps> = ({ address, ftTransfers, tx }) => (
  <Fragment>
    {ftTransfers.map(ftTransfer => {
      const token = ftTransfer.asset_identifier.split('::')[0];
      const { asset } = getAssetNameParts(ftTransfer.asset_identifier);
      const {
        ftMetadata: { data: ftMetadata },
      } = useTokenMetadata(token, 'fungible_tokens');
      const symbol = ftMetadata?.symbol || getTicker(asset).toUpperCase();
      return (
        <TransferListItem
          tx={tx}
          title={`${symbol || 'Token'} transfer`}
          sender={ftTransfer.sender}
          recipient={ftTransfer.recipient}
          amount={`${
            ftTransfer.amount ? ftDecimals(ftTransfer.amount, ftMetadata?.decimals || 0) : '-'
          } ${symbol}`}
          isOriginator={address === ftTransfer.sender}
        />
      );
    })}
  </Fragment>
);

interface NftTransfersProps {
  address: string;
  nftTransfers: AddressTransactionWithTransfersNftTransfers[];
  tx: Transaction;
}

const NftTransfers: FC<NftTransfersProps> = ({ address, nftTransfers, tx }) => (
  <Fragment>
    {nftTransfers.map(nftTransfer => {
      const collection = nftTransfer.asset_identifier.split('::')[1] || 'NFT';
      const { asset } = getAssetNameParts(nftTransfer.asset_identifier);
      const symbol = getTicker(asset).toUpperCase();
      return (
        <TransferListItem
          tx={tx}
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

export const TxsListWithTransfers: FC<TxsListWithTransfersProps> = memo(
  ({ address, response, showFooter, infinite, limit }) => {
    const { activeFilters } = useFilterState();
    const txsWithTransfers = useMemo(
      () => response.data?.pages.map(page => page.results).flat(),
      [response]
    );
    const filteredTxsWithTransfers = useMemo(
      () =>
        txsWithTransfers
          ?.filter(txWithTransfer => activeFilters[(txWithTransfer.tx as Transaction).tx_type])
          .slice(0, infinite ? undefined : limit),
      [txsWithTransfers, activeFilters]
    );

    const hasTxsWithTransfers = !!txsWithTransfers?.length;
    const hasVisibleTxsWithTransfers = !!filteredTxsWithTransfers?.length;

    return (
      <Fragment>
        {hasTxsWithTransfers && !hasVisibleTxsWithTransfers ? (
          <FilteredMessage />
        ) : hasVisibleTxsWithTransfers ? (
          filteredTxsWithTransfers?.map(({ tx, stx_transfers, ft_transfers, nft_transfers }) => (
            <Fragment>
              <StxTransfers address={address} stxTransfers={stx_transfers} tx={tx as Transaction} />
              {ft_transfers && (
                <FtTransfers address={address} ftTransfers={ft_transfers} tx={tx as Transaction} />
              )}
              {nft_transfers && (
                <NftTransfers
                  address={address}
                  nftTransfers={nft_transfers}
                  tx={tx as Transaction}
                />
              )}
              <TxsListItem
                tx={tx as Transaction}
                key={`txs-list-item-${(tx as Transaction).tx_id}`}
              />
            </Fragment>
          ))
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
  }
);

interface MempoolTxsListProps extends TxsListCommonProps {
  response: UseInfiniteQueryResult<ApiResponseWithResultsOffset<MempoolTransaction>>;
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
