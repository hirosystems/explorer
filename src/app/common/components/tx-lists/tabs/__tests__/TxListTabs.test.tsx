import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { TxListTabs } from '../TxListTabs';
import { usePathname as usePathNameActual } from 'next/navigation';
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { TxFilterTypes } from '@/features/transactions-filter/transactions-filter-slice';
import { fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const queryClient = new QueryClient();
const mockStore = configureMockStore();
let store: MockStoreEnhanced<unknown>;
const usePathname = usePathNameActual as jest.MockedFunction<typeof usePathNameActual>;

describe('TxListTabs component', () => {
  beforeEach(() => {
    usePathname.mockReset();
    store = mockStore({
      [TxFilterTypes.TxsPageTxFilter]: {
        isVisible: false,
      },
      [TxFilterTypes.AddressTxFilter]: {
        isVisible: false,
      },
    });
  });

  it('renders correctly', () => {
    usePathname.mockReturnValue('/transactions');

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    render(
      <Provider store={store}>
        <TxListTabs confirmedList={confirmedList} mempoolList={mempoolList} />
      </Provider>
    );

    expect(screen.getByText('Confirmed List')).toBeInTheDocument();

    const pendingTab = screen.getByRole('tab', { name: /Pending/i });
    fireEvent.click(pendingTab);
    expect(screen.getByText('Mempool List')).toBeInTheDocument();
  });

  it('displays CSVDownloadButton if on address page', () => {
    usePathname.mockReturnValue('/address/test-address');
    const routerMock = {
      pathname: '/address/test-address',
      route: '/address/[address]',
      query: { address: 'test-address' },
      asPath: '/address/test-address',
    } as unknown as NextRouter;

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterContext.Provider value={routerMock}>
            <TxListTabs confirmedList={confirmedList} mempoolList={mempoolList} />
          </RouterContext.Provider>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /Export as CSV/i })).toBeInTheDocument();
  });

  it('does not display CSVDownloadButton if not on address page', () => {
    usePathname.mockReturnValue('/transactions');

    const confirmedList = <div>Confirmed List</div>;
    const mempoolList = <div>Mempool List</div>;

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TxListTabs confirmedList={confirmedList} mempoolList={mempoolList} />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.queryByRole('button', { name: /Export as CSV/i })).not.toBeInTheDocument();
  });
});
