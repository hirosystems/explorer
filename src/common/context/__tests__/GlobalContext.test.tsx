import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams as useSearchParamsActual } from 'next/navigation';
import { useContext } from 'react';

import { fetchCustomNetworkId } from '../../components/modals/AddNetwork/utils';
import { GlobalContext, GlobalContextProvider } from '../GlobalContextProvider';

const useSearchParams = useSearchParamsActual as jest.MockedFunction<typeof useSearchParamsActual>;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: (key: string) => {
      if (key === 'chain') return 'custom';
      return null;
    },
  })),
}));

jest.mock('@stacks/blockchain-api-client', () => ({
  connectWebSocketClient: jest.fn(),
  createClient: jest.fn(() => ({ use: jest.fn() })),
}));

jest.mock('../../components/modals/AddNetwork/utils', () => ({
  ...jest.requireActual('../../components/modals/AddNetwork/utils'),
  fetchCustomNetworkId: jest.fn(() => Promise.resolve('custom-network-id')),
}));

const customApiUrl = 'https://my-custom-api-url.com/something';

const GlobalContextTestComponent = () => {
  const { activeNetwork, networks } = useContext(GlobalContext);
  return (
    <div>
      <div>Global Context Test</div>
      <div data-testid="activeNetwork">{JSON.stringify(activeNetwork)}</div>
      <div data-testid="networks">{JSON.stringify(networks)}</div>
    </div>
  );
};

const getContextField = (fieldId: string) => {
  return JSON.parse(screen.getByTestId(fieldId).innerHTML);
};

describe('GlobalContext', () => {
  beforeEach(() => {
    useSearchParams.mockReset();
  });
  it('renders provider and children without error', () => {
    useSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'chain') return 'custom';
        return null;
      },
    } as any);
    render(
      <GlobalContextProvider addedCustomNetworksCookie={''} removedCustomNetworksCookie={''}>
        <GlobalContextTestComponent />
      </GlobalContextProvider>
    );

    expect(screen.getByText('Global Context Test')).toBeInTheDocument();
  });

  it('adds a custom network from a query string', async () => {
    useSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'chain') return 'custom';
        if (key === 'api') return customApiUrl;
        return null;
      },
    } as any);
    render(
      <GlobalContextProvider addedCustomNetworksCookie={''} removedCustomNetworksCookie={''}>
        <GlobalContextTestComponent />
      </GlobalContextProvider>
    );

    const networks = getContextField('networks');
    expect(Object.keys(networks).length).toBe(3);

    await waitFor(() => {
      expect(fetchCustomNetworkId).toHaveBeenCalledWith(customApiUrl, false);
    });

    await waitFor(() => {
      const updatedNetworks = getContextField('networks');
      expect(Object.keys(updatedNetworks).length).toBe(4);
      expect(updatedNetworks[customApiUrl].isCustomNetwork).toBe(true);
    });
  });
});
