import { fetchFromSidecar } from '@common/api/fetch';
import { Block } from '@blockstack/stacks-blockchain-api-types';

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

export const fetchBlock = ({ apiServer }: { apiServer: string }) => async ({
  hash,
}: {
  hash: Block['hash'];
}): Promise<Block> => {
  const resp = await fetchFromSidecar(apiServer)(`/block/${hash}`);

  const block = await resp.json();
  if (!resp.ok) {
    throw Error(block.error);
  }

  return block;
};

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

export const fetchBlocksList = (options: FetchBlocksListOptions) => async (): Promise<
  FetchBlocksListResponse
> => {
  const { apiServer, offset, limit = 30 } = options;

  const resp = await fetchFromSidecar(apiServer)(
    `/block?${constructLimitAndOffsetQueryParams(limit, offset)}`
  );
  return resp.json();
};
