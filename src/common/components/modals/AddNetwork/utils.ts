import { string } from 'yup';

import { ChainID } from '@stacks/transactions';

import { fetchFromApi } from '../../../api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '../../../constants/constants';

export async function validateUrl(
  missingErrorMessage: string,
  invalidErrorMessage: string,
  url?: string
) {
  if (!url) {
    return {
      isValid: false,
      message: missingErrorMessage,
    };
  }
  const isValid = await string()
    .matches(
      /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
    )
    .isValid(url);
  return {
    isValid,
    message: isValid ? '' : invalidErrorMessage,
  };
}

export const buildCustomNetworkUrl = (url: string) => {
  const urlObj = new URL(url);
  const hostname = encodeURIComponent(urlObj.hostname);
  const port = encodeURIComponent(urlObj.port);
  const pathname = !urlObj?.pathname || urlObj.pathname === '/' ? '' : urlObj.pathname;
  return `${hostname === 'localhost' ? 'http://' : 'https://'}${hostname}${port ? `:${port}` : ''}${
    pathname || ''
  }`;
};

export const fetchCustomNetworkId: (
  url: string,
  isSubnet: boolean
) => Promise<ChainID | undefined> = (url, isSubnet) => {
  return fetchFromApi(url)(DEFAULT_V2_INFO_ENDPOINT)
    .then(res => res.json())
    .then(res =>
      !isSubnet
        ? Object.values(ChainID).includes(res.network_id)
          ? (res.network_id as ChainID)
          : undefined
        : res.network_id
    )
    .catch();
};
