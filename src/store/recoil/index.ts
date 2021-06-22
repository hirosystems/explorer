// @ts-nocheck
import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { fetchFromSidecar } from '@common/api/fetch';
import { SearchResult } from '@common/types/search';
import { fetchAllAccountData } from '@common/api/accounts';
import { fetchPendingTxs, fetchTx } from '@common/api/transactions';
import { fetchContract } from '@common/api/contracts';
import { fetchBlock } from '@common/api/blocks';
import { networkCurrentUrlSelector } from '@store/recoil/network';

export const searchQueryState = atom<string | undefined>({
  key: 'search/query',
  default: undefined,
});

export const accountItemState = atomFamily<any, string | undefined>({
  key: 'items/account',
  default: selectorFamily<any, string | undefined>({
    key: 'items/account/default',
    get:
      principal =>
      async ({ get }) => {
        const apiServer = get(networkCurrentUrlSelector);
        if (principal) {
          return fetchAllAccountData(apiServer)(principal);
        }
        return undefined;
      },
  }),
});

export const blockItemState = atomFamily<any, string | undefined>({
  key: 'items/block',
  default: selectorFamily<any, string | undefined>({
    key: 'items/block/default',
    get:
      hash =>
      async ({ get }) => {
        const apiServer = get(networkCurrentUrlSelector);
        if (hash) {
          return fetchBlock(apiServer)(hash);
        }
        return undefined;
      },
  }),
});

export const txItemState = atomFamily<any, { query?: string; mempool?: boolean }>({
  key: 'items/tx',
  default: selectorFamily<any, { query?: string; mempool?: boolean }>({
    key: 'items/tx/default',
    get:
      ({ query, mempool }) =>
      async ({ get }) => {
        const apiServer = get(networkCurrentUrlSelector);
        if (query && !mempool) {
          if (query?.includes('.')) {
            const contract = await fetchContract(apiServer)(query);
            if ('tx_id' in contract) {
              return fetchTx(apiServer)(contract.tx_id);
            }
          } else {
            return fetchTx(apiServer)(query);
          }
        }
        if (query && mempool) {
          return fetchPendingTxs(apiServer)({ query, type: 'tx_id' });
        }
      },
  }),
});

export const searchBarFocus = atom({
  key: 'search.bar.focus',
  default: false,
});
export const searchBarHover = atom({
  key: 'search.bar.hover',
  default: false,
});

export const searchBarVisibility = atom({
  key: 'search.bar.visibility',
  default: 'hidden',
});
