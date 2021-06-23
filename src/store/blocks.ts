import { atomFamily, atomWithDefault } from 'jotai/utils';
import type { Block } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import deepEqual from 'fast-deep-equal';

import { apiClientsState } from '@store/api-clients';
import { atomFamilyWithQuery, atomWithQuery } from '@store/query';
import { ApiResponseWithResultsOffset } from '@common/types/api';

const paginatedResponseOffset = atomFamily(_key => atomWithDefault(() => 0), deepEqual);

// ----------------
// keys
// ----------------
export enum BlocksQueryKeys {
  CONFIRMED = 'blocks/CONFIRMED',
  // TODO: maybe something for microblocks here
  SINGLE = 'blocks/SINGLE',
}

export function makeBlocksSingleKey(hash: string) {
  return [BlocksQueryKeys.SINGLE, hash];
}

// ----------------
// types
// ----------------
export type BlocksListResponse = ApiResponseWithResultsOffset<Block>;

// ----------------
// queryFn's
// ----------------
const blocksListQueryFn = async (get: Getter) => {
  const { blocksApi } = get(apiClientsState);
  const offset = get(paginatedResponseOffset([BlocksQueryKeys.CONFIRMED, 'offset']));
  return (await blocksApi.getBlockList({
    offset,
  })) as BlocksListResponse; // cast due to limitation in api client
};

const blocksSingleQueryFn = async (get: Getter, hash: string) => {
  const { blocksApi } = get(apiClientsState);
  return (await blocksApi.getBlockByHash({
    hash,
  })) as Block;
};
// ----------------
// atoms
// ----------------
export const blocksListState = atomWithQuery<BlocksListResponse>(
  BlocksQueryKeys.CONFIRMED,
  blocksListQueryFn
);

export const blocksSingleState = atomFamilyWithQuery<string, Block>(
  BlocksQueryKeys.SINGLE,
  blocksSingleQueryFn
);
