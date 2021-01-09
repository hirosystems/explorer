import { useRecoilValue } from 'recoil';
import { networkModeState } from '@pages/_app';
import { NetworkMode } from '@common/types/network';

export const useNetworkMode = () => {
  const state = useRecoilValue<NetworkMode>(networkModeState);
  return state;
};
