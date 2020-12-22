import { atom } from 'recoil';

export const modalState = atom<string | null>({
  key: 'modal',
  default: null,
});
