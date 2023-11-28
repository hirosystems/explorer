'use client';

import { FtMetadataResponse, NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { useEffect, useState } from 'react';

export function useImageUrl(tokenMetadata?: FtMetadataResponse | NftMetadataResponse) {
  const url = tokenMetadata?.metadata?.cached_image;
  const [contentType, setContentType] = useState<string | null>('image');
  useEffect(() => {
    if (!url) return;
    void fetch(url)
      .then(response => {
        setContentType(response.headers.get('content-type'));
      })
      .catch(() => {
        // corrupted image
        setContentType(null);
      });
  }, [url]);
  return { url, contentType };
}
