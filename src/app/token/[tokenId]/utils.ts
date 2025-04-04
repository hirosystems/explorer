import { validateStacksContractId } from '@/common/utils/utils';
import { ArrowSquareOut, DiscordLogo, TelegramLogo, TwitterLogo } from '@phosphor-icons/react';

import StxIcon from '../../../ui/icons/StxIcon';
import { RISKY_NFT_RULES } from './consts';

export const isExplorerLink = (url: string) => {
  return url.includes('explorer.stacks.co') || url.includes('explorer.hiro.so');
};

export const getUrlName = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('http://', '').replace('https://', '').replace('www.', '');
  } catch (_) {
    return undefined;
  }
};

export const getLinkIcon = (url: string) => {
  if (url.includes('discord.com/')) {
    return DiscordLogo;
  }
  if (isExplorerLink(url)) {
    return StxIcon;
  }
  if (url.includes('twitter.com/')) {
    return TwitterLogo;
  }
  if (url.includes('/t.me/')) {
    return TelegramLogo;
  }
  return ArrowSquareOut;
};

/**
 * Checks if a contract name matches any of the risky NFT patterns
 * @param contractName The contract name to check
 * @returns True if the contract name matches any risky pattern, false otherwise
 */
export function isRiskyNFTContract(contractName: string): boolean {
  if (!contractName || !validateStacksContractId(contractName)) return false;

  return RISKY_NFT_RULES.some(rule => rule.test(contractName));
}
