import { useAtom } from 'jotai';
import { networkModeState } from '@store/recoil/network';

export const useNetworkMode = () => {
  const [networkMode, setNetworkMode] = useAtom(networkModeState);
  return { networkMode, setNetworkMode };
};
