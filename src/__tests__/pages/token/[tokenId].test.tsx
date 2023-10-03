import '@testing-library/jest-dom';
import { getServerSideProps } from '../../../pages/token/[tokenId]';
import { apiClients as apiClientsActual } from '@/common/api/client';

global.fetch = jest.fn();
const apiClients = apiClientsActual as jest.MockedFunction<any>;
const fetch = global.fetch as jest.MockedFunction<any>;

jest.mock('@/common/api/client', () => ({
  apiClients: jest.fn(),
  createConfig: jest.fn(),
}));

jest.mock('@hirosystems/token-metadata-api-client', () => ({
  Configuration: jest.fn(),
}));

console.error = jest.fn();

describe('getServerSideProps', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skips fetching token for testnet', async () => {
    const context = {
      params: { tokenId: 'token1' },
      query: { chain: 'testnet' },
    };

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({ props: {} });
    expect(console.error).toBeCalledWith(new Error('cannot fetch token info for this request'));
  });

  it('skips fetching token for custom api', async () => {
    const context = {
      params: { tokenId: 'token1' },
      query: { chain: 'mainnet', api: 'custom' },
    };
    const result = await getServerSideProps(context as any);

    expect(result).toEqual({ props: {} });
    expect(console.error).toBeCalledWith(new Error('cannot fetch token info for this request'));
  });

  it('skips fetching token if tokenId is missing', async () => {
    const context = {
      params: {},
      query: { chain: 'mainnet' },
    };
    const result = await getServerSideProps(context as any);

    expect(result).toEqual({ props: {} });
    expect(console.error).toBeCalledWith(new Error('cannot fetch token info for this request'));
  });

  it('skips fetching token if missing from tokenMetadataApi', async () => {
    const context = {
      params: { tokenId: 'token1' },
      query: { chain: 'mainnet' },
    };

    apiClients.mockImplementationOnce(() => ({
      tokenMetadataApi: {
        getFtMetadata: jest.fn().mockResolvedValue({ name: null, symbol: 'SYMBOL' }),
      },
    }));

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({ props: {} });
    expect(console.error).toBeCalledWith(new Error('token not found'));
  });

  it('returns basic token info if CoinGecko does not have the token', async () => {
    const context = {
      params: { tokenId: 'token1' },
      query: { chain: 'mainnet' },
    };
    apiClients.mockImplementationOnce(() => ({
      tokenMetadataApi: {
        getFtMetadata: jest.fn().mockResolvedValue({ name: 'NAME', symbol: 'SYMBOL' }),
      },
    }));

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ coins: [] }),
    });

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({
      props: {
        basic: {
          name: 'NAME',
          symbol: 'SYMBOL',
          totalSupply: null,
        },
      },
    });
    expect(console.error).toBeCalledWith("couldn't find token in Coingecko");
  });

  it('returns token info if CoinGecko has token', async () => {
    const context = {
      params: { tokenId: 'token1' },
      query: { chain: 'mainnet' },
    };

    apiClients.mockImplementationOnce(() => ({
      tokenMetadataApi: {
        getFtMetadata: jest.fn().mockResolvedValue({ name: 'NAME', symbol: 'SYMBOL' }),
      },
    }));

    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ coins: [{ id: 'ID', symbol: 'SYMBOL' }] }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ name: 'NAME', symbol: 'SYMBOL' }),
      });

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({
      props: {
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
      },
    });
  });
});
