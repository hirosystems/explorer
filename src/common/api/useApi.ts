'use client';

import { Configuration as TokenMetadataApiConfiguration } from '@hirosystems/token-metadata-api-client';

import { useGlobalContext } from '../context/useAppContext';
import { apiClients, createConfig } from './client';

export const useApi = () => {
  const basePath = useGlobalContext().activeNetworkKey;
  const apiConfig = createConfig(basePath);
  const tokenMetadataApiConfig = new TokenMetadataApiConfiguration({
    basePath,
  });
  return apiClients(apiConfig, tokenMetadataApiConfig);
};
