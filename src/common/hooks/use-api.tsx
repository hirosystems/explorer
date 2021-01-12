import { useRecoilValue } from 'recoil';
import { networkCurrentUrlSelector } from '@store/network';

export const useApiServer = (): string => {
  const network = useRecoilValue(networkCurrentUrlSelector);
  return network as string;
};
