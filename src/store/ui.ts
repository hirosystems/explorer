import { atomFamily } from 'jotai/utils';
import { Atom, atom } from 'jotai';

export const tabIndexState = atomFamily<string, Atom<number>>(_param => atom(0));
