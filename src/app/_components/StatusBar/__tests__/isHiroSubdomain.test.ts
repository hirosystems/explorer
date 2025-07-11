import { isHiroSubdomain } from '../../../../common/utils/network-utils';

describe('isValidSubdomain', () => {
  it('should return true for a valid subdomain of hiro.so', () => {
    expect(isHiroSubdomain('https://api.hiro.so')).toBe(true);
    expect(isHiroSubdomain('https://another.api.hiro.so')).toBe(true);
    expect(isHiroSubdomain('http://another.api.hiro.so')).toBe(true);
    expect(isHiroSubdomain('https://api.nakamoto-2.testnet.hiro.so')).toBe(true);
  });

  it('should return false for an invalid subdomain', () => {
    expect(isHiroSubdomain('https://api.hiro.org')).toBe(false);
    expect(isHiroSubdomain('https://nothiro.so')).toBe(false);
  });

  it('should return false for a domain that doesn’t match hiro.so', () => {
    expect(isHiroSubdomain('https://api.otherdomain.com')).toBe(false);
    expect(isHiroSubdomain('https://api.nothiro.so')).toBe(false);
  });

  it('should return false for an invalid URL', () => {
    expect(isHiroSubdomain('hiro')).toBe(false);
  });

  it('should handle cases with ports or paths', () => {
    expect(isHiroSubdomain('https://api.hiro.so:8080/path')).toBe(true);
    expect(isHiroSubdomain('https://api.hiro.so/path')).toBe(true);
  });
});
