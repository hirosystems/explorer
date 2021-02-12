import { useRecoilState } from 'recoil';
import { unlockingState } from '@store/unlocking';

export const useUnlockingState = () => {
  const [state, setState] = useRecoilState(unlockingState);

  return [state, setState];
};
