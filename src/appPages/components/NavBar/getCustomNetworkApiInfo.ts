import { DEFAULT_V2_INFO_ENDPOINT } from '@/common/constants';

export const getCustomNetworkApiInfo = (baseUrl: string) => () =>
  fetch(`${baseUrl}${DEFAULT_V2_INFO_ENDPOINT}`).then(res => res.json());
