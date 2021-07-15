import { atom } from 'jotai';
import {
  DEFAULT_NETWORK_INDEX,
  DEFAULT_NETWORK_LIST,
  IS_BROWSER,
  NETWORK_CURRENT_INDEX_COOKIE,
} from '@common/constants';

import { parseCookies, setCookie } from 'nookies';
import { IS_SSR } from 'jotai-query-toolkit';
import Router from 'next/router';

const atomWithCookie = <T>({ key, initialValue }: { key: string; initialValue: T }) => {
  const baseAtom = atom<T>(initialValue);
  const anAtom = atom<T, T | undefined>(
    get => {
      if (!IS_SSR) {
        const cookies = parseCookies();
        if (cookies && key in cookies) {
          const saved = cookies[key];
          return JSON.parse(saved) as unknown as T;
        }
      }
      return get(baseAtom);
    },
    (_get, set, update) => {
      if (!IS_SSR) {
        if (update !== undefined) {
          setCookie(null, key, JSON.stringify(update), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
          set(baseAtom, update);
        }
      }
    }
  );
  return anAtom;
};

export const networkModeState = atom(null);

export const customNetworksListState = atom<{ label: string; url: string }[]>([]);

export const networkListState = atom(get => {
  const customItems = get(customNetworksListState);
  return [...DEFAULT_NETWORK_LIST, ...customItems];
});

export const networkIndexState = atomWithCookie({
  key: NETWORK_CURRENT_INDEX_COOKIE,
  initialValue: DEFAULT_NETWORK_INDEX,
});

export const networkCurrentSelector = atom(get => {
  const index = get(networkIndexState);
  const list = get(networkListState);
  return list[index];
});

export const networkCurrentUrlSelector = atom(get => get(networkCurrentSelector).url);

export const networkSwitchingState = atom<'idle' | 'pending'>('idle');

export const showDifferentNetworkModalState = atom(get => {
  const networkMode = get(networkModeState);
  const switchingState = get(networkSwitchingState);
  const isSwitching = switchingState === 'pending';
  const query = Router.router?.query;
  const chainMode = query?.['chain'];
  return IS_BROWSER && chainMode && !isSwitching && chainMode !== networkMode;
});
