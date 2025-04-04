import { ArrowSquareOut, DiscordLogo, TelegramLogo, TwitterLogo } from '@phosphor-icons/react';

import StxIcon from '../../../../ui/icons/StxIcon';
import { getLinkIcon, getUrlName, isExplorerLink, isRiskyNFTContract } from '../utils';

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
    expect(getLinkIcon('https://discord.com/')).toBe(DiscordLogo);
  });

  it('should return StxIcon for explorer url', () => {
    expect(getLinkIcon('https://explorer.stacks.co')).toBe(StxIcon);
  });

  it('should return BsTwitter for twitter url', () => {
    expect(getLinkIcon('https://twitter.com/')).toBe(TwitterLogo);
  });

  it('should return BiLogoTelegram for telegram url', () => {
    expect(getLinkIcon('https://t.me/')).toBe(TelegramLogo);
  });

  it('should return BiLinkExternal for any other url', () => {
    expect(getLinkIcon('https://github.com')).toBe(ArrowSquareOut);
  });
});

describe('isRiskyNFTContract', () => {
  it('should return true for contract names ending with .StacksDao', () => {
    expect(isRiskyNFTContract('SP1J45NVEGQ7ZA4M57TGF0RAB00TMYCYG00X8EF5B.StacksDao')).toBe(true);
  });

  it('should return false for contract names with similar but different endings', () => {
    expect(isRiskyNFTContract('SP1J45NVEGQ7ZA4M57TGF0RAB00TMYCYG00X8EF5B.stacksdao')).toBe(false);
    expect(isRiskyNFTContract('SP1J45NVEGQ7ZA4M57TGF0RAB00TMYCYG00X8EF5B.StacksDAO')).toBe(false);
    expect(isRiskyNFTContract('SP1J45NVEGQ7ZA4M57TGF0RAB00TMYCYG00X8EF5B.StacksDaoExtra')).toBe(
      false
    );
  });

  it('should return false for invalid contract names', () => {
    expect(isRiskyNFTContract('')).toBe(false);
    expect(isRiskyNFTContract('not-a-contract')).toBe(false);
    expect(isRiskyNFTContract('SP1J45NVEGQ7ZA4M57TGF0RAB00TMYCYG00X8EF5B')).toBe(false);
  });
});
