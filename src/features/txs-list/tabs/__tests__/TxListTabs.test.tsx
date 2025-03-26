import { renderWithProviders } from '@/common/utils/test-utils/render-utils';
import { Box } from '@chakra-ui/react';
import { screen, waitFor } from '@testing-library/react';
import { useParams as useParamsActual } from 'next/navigation';
import { act } from 'react';

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

    let utils;
    await act(async () => {
      utils = renderWithProviders(
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Confirmed List')).toBeInTheDocument();
    });

    await act(async () => {
      const pendingTab = screen.getByRole('tab', { name: /pending/i });
      pendingTab.click();
    });

    await waitFor(() => {
      expect(utils.getByText('Mempool List')).toBeVisible();
    });
  });

  it('displays CSVDownloadButton if on address page', async () => {
    useParams.mockReturnValue({ principal: 'test-address' });
    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    await act(async () => {
      renderWithProviders(
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Export as CSV/i })).toBeInTheDocument();
    });
  });

  it('does not display CSVDownloadButton if not on address page', async () => {
    useParams.mockReturnValue({});

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    await act(async () => {
      renderWithProviders(
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Export as CSV/i })).not.toBeInTheDocument();
    });
  });
});
