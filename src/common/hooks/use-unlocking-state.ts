import { useRecoilState } from 'recoil';
import { unlockingState } from '@store/recoil/unlocking';

export const useUnlockingState = () => {
  return useRecoilState(unlockingState);
};
