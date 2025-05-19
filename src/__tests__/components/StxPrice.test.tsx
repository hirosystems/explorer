import { render } from '@testing-library/react';
import { StxPrice } from '../../common/components/StxPrice';
import { useStxPriceForTx } from '../../common/components/StxPriceButton/useStxPriceForTx';
import { useGlobalContext } from '../../common/context/useGlobalContext';

jest.mock('../../common/components/StxPriceButton/useStxPriceForTx');
jest.mock('../../common/context/useGlobalContext');

const mockTx: any = { tx_type: 'token_transfer', tx_id: '0x1' };

const useStxPriceForTxMock = useStxPriceForTx as jest.Mock;
const useGlobalContextMock = useGlobalContext as jest.Mock;

describe('StxPrice component', () => {
  it('does not render when price data is unavailable', () => {
    useStxPriceForTxMock.mockReturnValue({ currentStxPrice: 0, historicalStxPrice: 0 });
    useGlobalContextMock.mockReturnValue({ activeNetwork: { mode: 'mainnet' } });

    const { container } = render(<StxPrice tx={mockTx} value={1000} />);
    expect(container.firstChild).toBeNull();
  });
});
