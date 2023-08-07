import { useContext } from 'react';
import { AppContextProvider, GlobalContext } from '../GlobalContext';
import { render, screen, waitFor } from '@testing-library/react';
import { fetchCustomNetworkId } from '@/components/add-network-form';

jest.mock('@/components/add-network-form', () => ({
  ...jest.requireActual('@/components/add-network-form'),
  fetchCustomNetworkId: jest.fn(() => '1111'),
}));

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

const apiUrls = {
  mainnet: 'https://api.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
};

const getContextField = (fieldId: string) => {
  return JSON.parse(screen.getByTestId(fieldId).innerHTML);
};

describe('GlobalContext', () => {
  it('renders provider and children without error', () => {
    render(
      <AppContextProvider apiUrls={apiUrls}>
        <GlobalContextTestComponent />
      </AppContextProvider>
    );

    expect(screen.getByText('Global Context Test')).toBeInTheDocument();
  });

  it('adds a custom network from a query string', async () => {
    const customApiUrl = 'https://my-custom-api-url.com/something';

    render(
      <AppContextProvider apiUrls={apiUrls} queryApiUrl={customApiUrl}>
        <GlobalContextTestComponent />
      </AppContextProvider>
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
