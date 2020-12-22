import { useRecoilValue } from 'recoil';
import { networkCurrentUrlSelector } from '@store/network';
import { DEFAULT_TESETNET_SERVER } from '@common/constants';

export const useApiServer = (): string => {
  const network = useRecoilValue(networkCurrentUrlSelector);
  return network || DEFAULT_TESETNET_SERVER;
};
