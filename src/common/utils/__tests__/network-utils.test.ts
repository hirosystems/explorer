describe('getApiUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_MAINNET_API_SERVER;
    delete process.env.NEXT_PUBLIC_TESTNET_API_SERVER;
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use default mainnet URL when env var is not set', () => {
    // Import the function inside the test after resetting modules
    const { getApiUrl } = require('../network-utils');
    const { DEFAULT_MAINNET_SERVER } = require('@/common/constants/env');

    const result = getApiUrl('mainnet');
    expect(result).toBe('https://api.hiro.so');
    expect(DEFAULT_MAINNET_SERVER).toBe('https://api.hiro.so');
  });

  it('should use default testnet URL when env var is not set', () => {
    const { getApiUrl } = require('../network-utils');
    const { DEFAULT_TESTNET_SERVER } = require('@/common/constants/env');

    const result = getApiUrl('testnet');
    expect(result).toBe('https://api.testnet.hiro.so');
    expect(DEFAULT_TESTNET_SERVER).toBe('https://api.testnet.hiro.so');
  });

  it('should use env var value for mainnet when available', () => {
    process.env.NEXT_PUBLIC_MAINNET_API_SERVER = 'https://custom-mainnet-api.example.com';

    const { getApiUrl } = require('../network-utils');
    const { DEFAULT_MAINNET_SERVER } = require('@/common/constants/env');

    const result = getApiUrl('mainnet');
    expect(result).toBe('https://custom-mainnet-api.example.com');
    expect(DEFAULT_MAINNET_SERVER).toBe('https://custom-mainnet-api.example.com');
  });

  it('should use env var value for testnet when available', () => {
    process.env.NEXT_PUBLIC_TESTNET_API_SERVER = 'https://custom-testnet-api.example.com';

    const { getApiUrl } = require('../network-utils');
    const { DEFAULT_TESTNET_SERVER } = require('@/common/constants/env');

    const result = getApiUrl('testnet');
    expect(result).toBe('https://custom-testnet-api.example.com');
    expect(DEFAULT_TESTNET_SERVER).toBe('https://custom-testnet-api.example.com');
  });

  it('should prioritize customApiUrl over env values', () => {
    process.env.NEXT_PUBLIC_MAINNET_API_SERVER = 'https://env-mainnet.example.com';
    const customUrl = 'https://override-api.example.com';

    const { getApiUrl } = require('../network-utils');

    const result = getApiUrl('mainnet', customUrl);
    expect(result).toBe(customUrl);
  });
});
