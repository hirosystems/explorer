import { ChakraProvider, Table } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import renderer from 'react-test-renderer';

import { system } from '../../../ui/theme/theme';
import { TokenRow } from '../TokenRow';

const tokenMetadata = {
  name: 'TestToken',
  tx_id: '0x1234',
  contract_principal: '0x5678',
  symbol: 'TT',
  total_supply: '1000000',
  image_uri: 'https://example.com/token.png',
  sender_address: '0x1234',
};

describe('TokenRow', () => {
  const queryClient = new QueryClient();

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={system}>
            <Table.Root>
              <TokenRow ftToken={tokenMetadata} />
            </Table.Root>
          </ChakraProvider>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
