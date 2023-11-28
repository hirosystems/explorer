import { BiLinkExternal, BiLogoTelegram } from 'react-icons/bi';
import { BsDiscord, BsTwitter } from 'react-icons/bs';

import { StxIcon } from '../../../../ui/icons';
import { getLinkIcon, getUrlName, isExplorerLink } from '../utils';

describe('isExplorerLink', () => {
  it('should return true for stacks.co explorer url', () => {
    expect(isExplorerLink('https://explorer.stacks.co')).toBe(true);
  });

  it('should return true for hiro.so explorer url', () => {
    expect(isExplorerLink('https://explorer.hiro.so')).toBe(true);
  });

  it('should return false for non explorer url', () => {
    expect(isExplorerLink('https://github.com')).toBe(false);
  });
});

describe('getUrlName', () => {
  it('should return hostname without protocol and www', () => {
    expect(getUrlName('https://www.github.com')).toBe('github.com');
  });

  it('should return hostname without protocol for urls without www', () => {
    expect(getUrlName('https://twitter.com')).toBe('twitter.com');
  });

  it('should return undefined for invalid urls', () => {
    expect(getUrlName('notAUrl')).toBe(undefined);
  });
});

describe('getLinkIcon', () => {
  it('should return BsDiscord for discord url', () => {
    expect(getLinkIcon('https://discord.com/')).toBe(BsDiscord);
  });

  it('should return StxIcon for explorer url', () => {
    expect(getLinkIcon('https://explorer.stacks.co')).toBe(StxIcon);
  });

  it('should return BsTwitter for twitter url', () => {
    expect(getLinkIcon('https://twitter.com/')).toBe(BsTwitter);
  });

  it('should return BiLogoTelegram for telegram url', () => {
    expect(getLinkIcon('https://t.me/')).toBe(BiLogoTelegram);
  });

  it('should return BiLinkExternal for any other url', () => {
    expect(getLinkIcon('https://github.com')).toBe(BiLinkExternal);
  });
});
