import { BiLinkExternal, BiLogoTelegram } from 'react-icons/bi';
import { BsDiscord, BsTwitter } from 'react-icons/bs';

import { StxIcon } from '../../../ui/icons';

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
    return BsDiscord;
  }
  if (isExplorerLink(url)) {
    return StxIcon;
  }
  if (url.includes('twitter.com/')) {
    return BsTwitter;
  }
  if (url.includes('/t.me/')) {
    return BiLogoTelegram;
  }
  return BiLinkExternal;
};
