import { useRecoilValue } from 'recoil';
import { networkModeState } from '@pages/_app';

export const useNetworkMode = () => {
  const state = useRecoilValue(networkModeState);
  return state;
};
