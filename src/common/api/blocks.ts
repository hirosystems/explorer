import { fetchFromSidecar } from '@common/api/fetch';
import { constructLimitAndOffsetQueryParams } from '@common/api/utils';

import type { Block } from '@stacks/stacks-blockchain-api-types';

export interface FetchBlocksListOptions {
  apiServer: string;
  offset?: number;
  limit?: number;
}

export interface FetchBlocksListResponse {
  results: Block[];
  total: number;
  limit: number;
  offset: 0;
}

/**
 * Fetch a block
 *
 * @param {string} apiServer - the current apiServer
 */
// TOREMOVE unused
export const fetchBlock =
  (apiServer: string) =>
  async (hash: Block['hash']): Promise<Block> => {
    const resp = await fetchFromSidecar(apiServer)(`/block/${hash}`);

    const block = await resp.json();
    if (!resp.ok) {
      throw Error(block.error);
    }

    return block;
  };

/**
 * Fetch list of blocks
 *
 * @param {FetchBlocksListOptions} options
 */
// TOREMOVE unused
export const fetchBlocksList =
  (options: FetchBlocksListOptions) => async (): Promise<FetchBlocksListResponse> => {
    const { apiServer, offset, limit = 30 } = options;

    const resp = await fetchFromSidecar(apiServer)(
      `/block?${constructLimitAndOffsetQueryParams(limit, offset)}`
    );
    return resp.json();
  };
