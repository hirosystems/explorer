import { Network } from '../types/network';

export function getQueryParams(network: Network) {
  const suffix = `?chain=${encodeURIComponent(network?.mode)}`;
  if (network?.isSubnet) {
    return `${suffix}&subnet=${network.url}`;
  }
  if (network?.isCustomNetwork) {
    return `${suffix}&api=${network.url}`;
  }
  return suffix;
}

export const buildUrl = (href: string, network: Network): string => {
  return `${href}${getQueryParams(network)}`;
};
