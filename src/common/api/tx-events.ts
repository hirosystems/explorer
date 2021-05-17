import { fetchFromSidecar } from '@common/api/fetch';

export interface FetchEventsPaginatedOptions {
  txId: string;
  apiServer: string;
  offset?: number;
  limit?: number;
}

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `event_limit=${limit}${offset ? `&event_offset=${offset}` : ''}`;

/**
 * Fetch paginated list of events for a tx
 *
 * @param {FetchEventsPaginatedOptions} options
 */
export const fetchEventsPaginated =
  (options: FetchEventsPaginatedOptions) => async (): Promise<any> => {
    const { txId, apiServer, offset, limit = 96 } = options;

    const resp = await fetchFromSidecar(apiServer)(
      `/tx/${txId}?${constructLimitAndOffsetQueryParams(limit, offset)}`
    );
    const data = await resp.json();
    if ('events' in data && data?.events) {
      return data?.events;
    }
    return [];
  };
