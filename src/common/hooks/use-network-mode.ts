import { useRecoilValue } from 'recoil';
import { networkModeState } from '@common/app-helpers';
import { NetworkMode } from '@common/types/network';

export const useNetworkMode = () => {
  const state = useRecoilValue<NetworkMode>(networkModeState);
  return state;
};
