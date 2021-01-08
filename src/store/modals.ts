import { atom } from 'recoil';
import type { AllModals } from '@common/constants';

export const modalState = atom<AllModals | null>({
  key: 'modal',
  default: null,
});
