import { Network } from '@/common/types/network';
import { LinkProps } from 'next/link';

export const getQueryParams = (network: Network): string => {
  const suffix = `?chain=${encodeURIComponent(network?.mode)}`;
  if (network?.isSubnet) {
    return `${suffix}&subnet=${network.url}`;
  }
  if (network?.isCustomNetwork) {
    return `${suffix}&api=${network.url}`;
  }
  return suffix;
};

export const buildUrl = (href: LinkProps['href'], network: Network): string => {
  return `${href}${getQueryParams(network)}`;
};
