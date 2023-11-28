import { useQuery } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react';

import { ChainID } from '@stacks/transactions';

import { useGlobalContext } from '../../../../common/context/useAppContext';
import { Network, NetworkModes } from '../../../../common/types/network';
import { NetworkLabel } from '../NetworkLabel';

jest.mock('../../../../common/context/useAppContext', () => ({
  useGlobalContext: jest.fn().mockReturnValue({
    activeNetwork: { url: 'testUrl' },
    removeCustomNetwork: jest.fn(),
    apiUrls: { mainnet: 'mainnetUrl', testnet: 'testnetUrl' },
  }),
}));

jest.mock('@chakra-ui/react', () => {
  const original = jest.requireActual('@chakra-ui/react');
  return {
    ...original,
    useColorMode: jest.fn().mockReturnValue({ colorMode: 'light' }),
  };
});

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const network: Network = {
  label: 'Mainnet',
  url: 'mainnetUrl',
  mode: NetworkModes.Mainnet,
  networkId: ChainID.Mainnet,
  btcBlockBaseUrl: 'btcBlockBaseUrl',
  btcTxBaseUrl: 'btcTxBaseUrl',
  btcAddressBaseUrl: 'btcAddressBaseUrl',
};

const customNetwork = {
  label: 'Custom',
  url: 'customUrl',
  isCustomNetwork: true,
  mode: NetworkModes.Testnet,
  networkId: ChainID.Testnet,
  btcBlockBaseUrl: 'btcBlockBaseUrl',
  btcTxBaseUrl: 'btcTxBaseUrl',
  btcAddressBaseUrl: 'btcAddressBaseUrl',
};

const subnetNetwork = {
  label: 'Subnet',
  url: 'subnetUrl',
  isSubnet: true,
  mode: NetworkModes.Testnet,
  networkId: ChainID.Testnet,
  btcBlockBaseUrl: 'btcBlockBaseUrl',
  btcTxBaseUrl: 'btcTxBaseUrl',
  btcAddressBaseUrl: 'btcAddressBaseUrl',
};

describe('NetworkLabel', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
    });
  });

  it('renders mainnet badge for mainnet network', () => {
    const { getByText } = render(<NetworkLabel network={network} />);
    expect(getByText('Mainnet')).toBeInTheDocument();
    expect(getByText('mainnet')).toBeInTheDocument();
  });

  it('renders spinner while fetching custom network info', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isFetching: true,
    });

    const { getByTestId } = render(<NetworkLabel network={customNetwork} />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error when there is an issue fetching custom network info', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      error: new Error('Failed fetching'),
    });

    const { getByText } = render(<NetworkLabel network={customNetwork} />);
    expect(getByText('Offline')).toBeInTheDocument();
  });

  it('renders subnet badge for a subnet network', () => {
    const { getByText } = render(<NetworkLabel network={subnetNetwork} />);
    expect(getByText('subnet')).toBeInTheDocument();
  });

  it('triggers removeCustomNetwork when remove button is clicked', () => {
    const removeCustomNetworkMock = jest.fn();
    (useGlobalContext as jest.Mock).mockReturnValue({
      activeNetwork: { url: 'testUrl' },
      removeCustomNetwork: removeCustomNetworkMock,
      apiUrls: { mainnet: 'mainnetUrl', testnet: 'testnetUrl' },
    });

    const { getByLabelText } = render(<NetworkLabel network={customNetwork} />);
    const button = getByLabelText('Remove network');
    fireEvent.click(button);

    expect(removeCustomNetworkMock).toHaveBeenCalled();
  });
});
