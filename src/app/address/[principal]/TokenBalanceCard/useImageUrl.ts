'use client';

import { useEffect, useState } from 'react';

export function useImageUrl(metadataImageUrl?: string) {
  const [contentType, setContentType] = useState<string | null>('image');
  useEffect(() => {
    if (!metadataImageUrl) return;
    void fetch(metadataImageUrl)
      .then(response => {
        setContentType(response.headers.get('content-type'));
      })
      .catch(() => {
        // corrupted image
        setContentType(null);
      });
  }, [metadataImageUrl]);
  return { url: metadataImageUrl, contentType };
}
