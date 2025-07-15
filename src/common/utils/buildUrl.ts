import { Network } from '../types/network';
import { isLocalhost } from './network-utils';

export function getQueryParams(network: Network) {
  let suffix = `?chain=${encodeURIComponent(network?.mode || 'mainnet')}`;

  if (network?.isSubnet) {
    suffix += `&subnet=${network.url}`;
  } else if (network?.isCustomNetwork) {
    suffix += `&api=${network.url}`;
  }

  // Add ssr=false for devnet
  if (isLocalhost(network.url)) {
    suffix += '&ssr=false';
  }

  return suffix;
}

export const buildUrl = (href: string, network: Network): string => {
  return `${href}${getQueryParams(network)}`;
};
