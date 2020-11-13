import { useRecoilValue } from 'recoil';
import { apiServerState } from '@store/recoil';

export const useApiServer = (): string => {
  const apiServer = useRecoilValue(apiServerState);
  return apiServer || '';
};
