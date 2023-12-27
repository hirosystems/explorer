import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen } from '@testing-library/react';
import { useParams as useParamsActual } from 'next/navigation';

import { renderWithReduxProviders } from '../../../../common/utils/test-utils/renderWithReduxProvider';
import { TxListTabsBase } from '../TxListTabsBase';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

const queryClient = new QueryClient();
const useParams = useParamsActual as jest.MockedFunction<typeof useParamsActual>;

describe('TxListTabs component', () => {
  beforeEach(() => {
    useParams.mockReset();
  });

  it('renders correctly', () => {
    useParams.mockReturnValue({ principal: 'test-address' });

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    renderWithReduxProviders(
      <QueryClientProvider client={queryClient}>
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Confirmed List')).toBeInTheDocument();

    const pendingTab = screen.getByRole('tab', { name: /Pending/i });
    fireEvent.click(pendingTab);
    expect(screen.getByText('Mempool List')).toBeInTheDocument();
  });

  it('displays CSVDownloadButton if on address page', () => {
    useParams.mockReturnValue({ principal: 'test-address' });
    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    renderWithReduxProviders(
      <QueryClientProvider client={queryClient}>
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: /Export as CSV/i })).toBeInTheDocument();
  });

  it('does not display CSVDownloadButton if not on address page', () => {
    useParams.mockReturnValue({});

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    renderWithReduxProviders(
      <QueryClientProvider client={queryClient}>
        <TxListTabsBase confirmedList={confirmedList} mempoolList={mempoolList} />
      </QueryClientProvider>
    );

    expect(screen.queryByRole('button', { name: /Export as CSV/i })).not.toBeInTheDocument();
  });
});
