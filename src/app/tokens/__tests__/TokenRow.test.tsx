import renderer from 'react-test-renderer';
import { TokenRow } from '../TokenRow';
import { Table } from '@/ui/Table';

describe('TokenRow', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Table>
          <TokenRow
            name="TestToken"
            txId="0x1234"
            tokenId="0x5678"
            imgUrl="https://example.com/token.png"
            symbol="TT"
            totalSupply="1000000"
          />
        </Table>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
