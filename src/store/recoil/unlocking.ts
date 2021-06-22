import { atom } from 'recoil';

export const unlockingState = atom<any>({
  key: 'principal.unlocking',
  default: null,
});
