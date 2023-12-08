import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { getTokenInfo } from '../../../app/token/[tokenId]/getTokenInfo';
import { apiClients as apiClientsActual } from '../../../common/api/client';

global.fetch = jest.fn();
const apiClients = apiClientsActual as jest.MockedFunction<any>;
const fetch = global.fetch as jest.MockedFunction<any>;

jest.mock('../../../common/api/client', () => ({
  apiClients: jest.fn(),
  createConfig: jest.fn(),
}));

jest.mock('@hirosystems/token-metadata-api-client', () => ({
  Configuration: jest.fn(),
}));

console.error = jest.fn();

describe('getTokenInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips fetching token for testnet', async () => {
    const tokenId = 'token1';
    const chain = 'testnet';

    const result = await getTokenInfo(tokenId, chain);

    expect(result).toEqual({});
    expect(console.error).toBeCalledWith(new Error('cannot fetch token info for this request'));
  });

  it('skips fetching token for custom api', async () => {
    const tokenId = 'token1';
    const chain = 'mainnet';
    const api = 'custom';

    const result = await getTokenInfo(tokenId, chain, api);

    expect(result).toEqual({});
    expect(console.error).toBeCalledWith(new Error('cannot fetch token info for this request'));
  });

  it('skips fetching token if missing from tokenMetadataApi', async () => {
    const tokenId = 'token1';
    const chain = 'mainnet';

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ name: null, symbol: 'SYMBOL' }),
    });

    const result = await getTokenInfo(tokenId, chain);

    expect(result).toEqual({});
    expect(console.error).toBeCalledWith(new Error('token not found'));
  });

  it('returns basic token info if CoinGecko does not have the token', async () => {
    const tokenId = 'token1';
    const chain = 'mainnet';

    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ name: 'NAME', symbol: 'SYMBOL' }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ coins: [] }),
      });

    const result = await getTokenInfo(tokenId, chain);

    expect(result).toEqual({
      basic: {
        name: 'NAME',
        symbol: 'SYMBOL',
        totalSupply: null,
      },
    });
  });

  it('returns token info if CoinGecko has token', async () => {
    const tokenId = 'token1';
    const chain = 'mainnet';

    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ name: 'NAME', symbol: 'SYMBOL' }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ coins: [{ id: 'ID', symbol: 'SYMBOL' }] }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ name: 'NAME', symbol: 'SYMBOL' }),
      });

    const result = await getTokenInfo(tokenId, chain);

    expect(result).toEqual({
      basic: {
        name: 'NAME',
        symbol: 'SYMBOL',
        totalSupply: null,
      },
      extended: {
        categories: [],
        circulatingSupply: null,
        currentPrice: null,
        currentPriceInBtc: null,
        fullyDilutedValuation: null,
        links: {
          announcements: [],
          blockchain: [],
          chat: [],
          forums: [],
          repos: [],
          websites: [],
          social: [],
        },
        marketCap: null,
        priceChangePercentage24h: null,
        priceInBtcChangePercentage24h: null,
        tradingVolume24h: null,
        tradingVolumeChangePercentage24h: null,
        tvl: null,
        developerData: {},
      },
    });
  });
});
