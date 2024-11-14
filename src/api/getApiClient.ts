import { createClient } from '@stacks/blockchain-api-client';

import packageJson from '../../package.json';
import { RELEASE_TAG_NAME } from '../common/constants/env';

export const getApiClient = (baseUrl?: string) => {
  const apiClient = createClient({
    baseUrl,
  });

  apiClient.use({
    onRequest({ request }) {
      request.headers.set('x-hiro-product', 'explorer');
      request.headers.set('x-hiro-version', RELEASE_TAG_NAME || packageJson.version);
      return request;
    },
  });

  return apiClient;
};
