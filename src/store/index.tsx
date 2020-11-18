import { atomFamily, atom, selector, selectorFamily, AtomEffect } from 'recoil';
import { fetchFromSidecar } from '@common/api/fetch';
import { SearchResult } from '@common/types/search';
import { fetchAllAccountData } from '@common/api/accounts';
import { fetchTx, fetchPendingTxs } from '@common/api/transactions';
import { fetchContract } from '@common/api/contracts';
import { fetchBlock } from '@common/api/blocks';
import { parseCookies, setCookie } from 'nookies';

export const localStorageEffect = (key: string): AtomEffect<string> => ({ setSelf, onSet }) => {
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet(newValue => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  }
};

const cookieEffect = (key: string): AtomEffect<string> => ({ setSelf, onSet }) => {
  if (typeof window !== 'undefined') {
    const cookies = parseCookies();
    if (key in cookies) {
      const saved = cookies[key];
      setSelf(saved);
    }

    onSet(newValue => {
      setCookie(null, key, newValue as string, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
    });
  }
};

export const recentItemsState = atom({
  key: 'search.recent-items',
  default: selector({
    key: 'search.recent-items.default',
    get: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('recent_search_items');
        if (saved) {
          return JSON.parse(saved);
        }
      }
      return [];
    },
  }),
  effects_UNSTABLE: [localStorageEffect('recent_search_items')],
});

export const apiServerState = atom({
  key: 'app/apiServer',
  default: 'https://stacks-node-api.blockstack.org',
  effects_UNSTABLE: [cookieEffect('apiServer')],
});

export const searchQueryState = atom<string | undefined>({
  key: 'search/query',
  default: undefined,
});

export const accountItemState = atomFamily<any, string | undefined>({
  key: 'items/account',
  default: selectorFamily<any, string | undefined>({
    key: 'items/account/default',
    get: principal => async ({ get }) => {
      const apiServer = get(apiServerState);
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
    get: hash => async ({ get }) => {
      const apiServer = get(apiServerState);
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
    get: ({ query, mempool }) => async ({ get }) => {
      const apiServer = get(apiServerState);
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

export const searchItemsState = atom({
  key: 'search/items',
  default: selector({
    key: 'search/items/default',
    get: async ({ get }) => {
      const apiServer = get(apiServerState);
      const query = get(searchQueryState);
      if (apiServer && query) {
        const res = await fetchFromSidecar(apiServer)(`/search/${query}`);
        const result: SearchResult = await res.json();

        if (result?.found) {
          const _result = result.result;
          switch (_result.entity_type) {
            case 'tx_id': {
              const item = get(txItemState({ query: _result.entity_id, mempool: false }));
              return {
                type: 'search',
                data: [{ ...item, _type: 'tx', entity_id: _result.entity_id }],
              };
            }
            case 'contract_address': {
              const item = get(txItemState({ query: _result.entity_id, mempool: false }));
              return {
                type: 'search',
                data: [{ ...item, _type: 'tx', entity_id: _result.entity_id }],
              };
            }
            case 'standard_address': {
              const item = get(accountItemState(_result.entity_id));
              return {
                type: 'search',
                data: [
                  {
                    ...item,
                    _type: 'principal',
                    principal: _result.entity_id,
                    entity_id: _result.entity_id,
                  },
                ],
              };
            }
            case 'block_hash': {
              const item = get(blockItemState(_result.entity_id));
              return {
                type: 'search',
                data: [{ ...item, _type: 'block', entity_id: _result.entity_id }],
              };
            }
            case 'mempool_tx_id': {
              const item = get(txItemState({ query: _result.entity_id, mempool: true }));
              return {
                type: 'search',
                data: [{ ...item, _type: 'tx', entity_id: _result.entity_id }],
              };
            }
          }
        } else {
          return {
            type: 'search',
            error: {
              success: false,
              message: result.error,
            },
            result,
          };
        }
      }
      const data =
        Object.values(get(recentItemsState))?.sort(
          (a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate)
        ) || [];
      return {
        type: 'recent',
        data,
      };
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
