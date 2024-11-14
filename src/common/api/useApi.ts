'use client';

import {
  Configuration as TokenMetadataApiConfiguration,
  TokensApi,
} from '@hirosystems/token-metadata-api-client';

import { useGlobalContext } from '../context/useGlobalContext';

export const useMetadataApi = () => {
  const basePath = useGlobalContext().activeNetworkKey;
  return new TokensApi(
    new TokenMetadataApiConfiguration({
      basePath,
    })
  );
};
