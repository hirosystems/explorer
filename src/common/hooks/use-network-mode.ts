import { useRecoilValue } from 'recoil';
import { networkModeState } from '@pages/_app';

export const useNetworkMode = () => {
  const state = useRecoilValue<'Testnet' | 'Mainnet' | null>(networkModeState);
  return state;
};
