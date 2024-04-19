import { ArrowSquareOut, DiscordLogo, TelegramLogo, TwitterLogo } from '@phosphor-icons/react';

import StxIcon from '../../../ui/icons/StxIcon';

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
