import type { Block } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';

import { apiClientsState } from '@store/api-clients';

import { ApiResponseWithResultsOffset } from '@common/types/api';
import { QueryRefreshRates } from '@common/constants';
import { atomFamilyWithQuery, makeQueryKey } from 'jotai-query-toolkit';
import { QueryKey } from 'react-query';

// ----------------
// keys
// ----------------
export enum BlocksQueryKeys {
  CONFIRMED = 'blocks/CONFIRMED',
  SINGLE = 'blocks/SINGLE',
}

export const getBlocksQueryKey = {
  confirmed: (limit: number): QueryKey => makeQueryKey(BlocksQueryKeys.CONFIRMED, limit),
  single: (blockHash: string): QueryKey => makeQueryKey(BlocksQueryKeys.SINGLE, blockHash),
};

// ----------------
// types
// ----------------
export type BlocksListResponse = ApiResponseWithResultsOffset<Block>;

const blocksSingleQueryFn = async (get: Getter, hash: string) => {
  const { blocksApi } = get(apiClientsState);
  return (await blocksApi.getBlockByHash({
    hash,
  })) as Block;
};
// ----------------
// atoms
// ----------------

export const blocksSingleState = atomFamilyWithQuery<string, Block>(
  BlocksQueryKeys.SINGLE,
  blocksSingleQueryFn,
  // blocks have no reason to refresh, they are pretty static
  { refetchInterval: QueryRefreshRates.None, getShouldRefetch: () => false }
);
