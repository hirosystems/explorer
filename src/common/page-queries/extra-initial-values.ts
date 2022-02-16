import { setCurrentlyInView } from '@common/set-currently-in-view';
import type { InView } from '@store/currently-in-view';
import type { Atom } from 'jotai/core/atom';
import type { InitialValuesAtomBuilder } from 'jotai-query-toolkit/nextjs';

export const pageAtomBuilders: InitialValuesAtomBuilder[] = [
  [
    'inView',
    (inView?: InView): Readonly<[Atom<unknown>, unknown]> =>
      setCurrentlyInView(inView?.type, inView?.payload),
  ],
];
