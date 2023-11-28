'use client';

import { Configuration as TokenMetadataApiConfiguration } from '@hirosystems/token-metadata-api-client';

import { useGlobalContext } from '../context/useAppContext';
import { apiClients, createConfig } from './client';

export const useApi = () => {
  const apiConfig = createConfig(useGlobalContext().activeNetwork.url);
  const tokenMetadataApiConfig = new TokenMetadataApiConfiguration({
    basePath: useGlobalContext().activeNetwork.url,
  });
  return apiClients(apiConfig, tokenMetadataApiConfig);
};
