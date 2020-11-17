import { useRecoilValue } from 'recoil';
import { apiServerState } from '@store';

export const useApiServer = (): string => {
  const apiServer = useRecoilValue(apiServerState);
  return apiServer || '';
};
