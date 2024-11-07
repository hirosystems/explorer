'use client';

import { useQuery } from '@tanstack/react-query';

export function useImageUrl(metadataImageUrl?: string) {
  const { data: contentType } = useQuery({
    queryKey: ['image-content-type', metadataImageUrl],
    queryFn: async () => {
      try {
        if (!metadataImageUrl) return 'image';
        const response = await fetch(metadataImageUrl);
        return response.headers.get('content-type');
      } catch (error) {
        return null;
      }
    },
    enabled: !!metadataImageUrl,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return { url: metadataImageUrl, contentType: contentType ?? 'image' };
}
