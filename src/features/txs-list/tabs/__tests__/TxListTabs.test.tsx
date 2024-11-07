import { renderWithProviders } from '@/common/utils/test-utils/render-utils';
import { Box } from '@chakra-ui/react';
import { act, screen, waitFor } from '@testing-library/react';
import { useParams as useParamsActual } from 'next/navigation';

import { TxListTabsBase } from '../TxListTabsBase';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

const useParams = useParamsActual as jest.MockedFunction<typeof useParamsActual>;

describe('TxListTabs component', () => {
  beforeEach(() => {
    useParams.mockReset();
  });

  it('renders correctly', async () => {
    useParams.mockReturnValue({ principal: 'test-address' });

    const confirmedList = <Box>Confirmed List</Box>;
    const mempoolList = <Box>Mempool List</Box>;

    const { getByText } = renderWithProviders(
      <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
    );

    expect(screen.getByText('Confirmed List')).toBeInTheDocument();

    const pendingTab = screen.getByRole('tab', { name: /pending/i });

    await act(async () => {
      pendingTab.click();
    });

    await waitFor(() => {
      expect(getByText('Mempool List')).toBeVisible();
    });
  });

  it('displays CSVDownloadButton if on address page', () => {
    useParams.mockReturnValue({ principal: 'test-address' });
    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    renderWithProviders(<TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />);

    expect(screen.getByRole('button', { name: /Export as CSV/i })).toBeInTheDocument();
  });

  it('does not display CSVDownloadButton if not on address page', () => {
    useParams.mockReturnValue({});

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    renderWithProviders(<TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />);

    expect(screen.queryByRole('button', { name: /Export as CSV/i })).not.toBeInTheDocument();
  });
});
