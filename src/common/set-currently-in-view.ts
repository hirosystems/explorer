import { currentlyInViewState, InView } from '@store/currently-in-view';
import { Atom } from 'jotai/core/atom';

export function setCurrentlyInView(
  type?: InView['type'],
  payload?: InView['payload']
): readonly [Atom<unknown>, unknown] {
  return [currentlyInViewState, type && payload ? { type, payload } : null] as const;
}
