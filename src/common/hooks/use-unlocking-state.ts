import { useRecoilState } from 'recoil';
import { unlockingState } from '@store/unlocking';

export const useUnlockingState = () => {
  return useRecoilState(unlockingState);
};
