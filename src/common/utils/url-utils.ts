'use client';

import { usePathname } from 'next/navigation';
import { isWebUri } from 'valid-url';

export const isIconUrl = (url: string): boolean => !!isWebUri(url) && isImage(url);

const isImage = (url: string): boolean => {
  const [urlWithoutParams] = url.split('?');
  const extension = urlWithoutParams.split('.').pop();
  return !!extension && ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension);
};

export const useIsRedesignUrl = (): boolean => {
  const pathname = usePathname();
  if (pathname === '/home-redesign') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }
  const queryParams = new URLSearchParams(window.location.search);
  const redesignParam = queryParams.get('redesign');
  return !!redesignParam;
};
