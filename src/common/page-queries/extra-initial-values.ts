import { setCurrentlyInView } from '@common/set-currently-in-view';
import type { InView } from '@store/currently-in-view';
import type { Atom } from 'jotai/core/atom';
import type { InitialValuesAtomBuilder } from 'jotai-query-toolkit/nextjs';
import { networkModeState } from '@store/recoil/network';
import { networkUrlState } from '@store/network';

export const pageAtomBuilders: InitialValuesAtomBuilder[] = [
  [
    'inView',
    (inView?: InView): Readonly<[Atom<unknown>, unknown]> =>
      setCurrentlyInView(inView?.type, inView?.payload),
  ],
  [
    'networkMode',
    (networkMode: string): Readonly<[Atom<unknown>, unknown]> => {
      return [networkModeState, networkMode] as const;
    },
  ],
  ['apiServer', (apiServer: string) => [networkUrlState, apiServer] as const],
];
