import { Network } from '@/common/types/network';
import { LinkProps } from 'next/link';

export const buildUrl = (href: LinkProps['href'], network: Network): string => {
  const url = `${href}?chain=${encodeURIComponent(network?.mode)}`;
  if (network?.isCustomNetwork) {
    return `${url}&api=${network.url}`;
  }
  return url;
};
