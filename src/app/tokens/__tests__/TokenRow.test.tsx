import renderer from 'react-test-renderer';

import { Table } from '../../../ui/Table';
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
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Table>
          <TokenRow ftToken={tokenMetadata} />
        </Table>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
