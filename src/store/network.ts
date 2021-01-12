import { atom, selector } from 'recoil';
import { cookieEffect } from '@store/utils';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  NETWORK_CURRENT_INDEX_COOKIE,
  NETWORK_LIST_COOKIE,
} from '@common/constants';

export const customNetworksListState = atom<{ label: string; url: string }[]>({
  key: 'app/network.list.custom',
  default: [],
  effects_UNSTABLE: [cookieEffect<{ label: string; url: string }[]>(NETWORK_LIST_COOKIE)],
});

export const networkListState = selector({
  key: 'app/network.list',
  get: ({ get }) => {
    const customItems = get(customNetworksListState);
    return [...DEFAULT_NETWORK_LIST, ...customItems];
  },
});

export const networkIndexState = atom({
  key: 'app/network.index',
  default: DEFAULT_NETWORK_INDEX,
  effects_UNSTABLE: [cookieEffect(NETWORK_CURRENT_INDEX_COOKIE)],
});

export const networkCurrentSelector = selector({
  key: 'app/network.current',
  get: ({ get }) => {
    const index = get(networkIndexState);
    const list = get(networkListState);
    return list[index];
  },
});

export const networkCurrentUrlSelector = selector({
  key: 'app/network.current.url',
  get: ({ get }) => {
    const current = get(networkCurrentSelector);
    return current.url;
  },
});
