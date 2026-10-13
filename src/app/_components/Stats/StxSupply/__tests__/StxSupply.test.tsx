import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { useSuspenseStxSupply } from '../../../../../common/queries/useStxSupply';
import { StxSupply } from '../index';

jest.mock('../../../../../common/queries/useStxSupply', () => ({
  useSuspenseStxSupply: jest.fn(),
}));
jest.mock('../../../../../common/context/useGlobalContext', () => ({
  useGlobalContext: () => ({ activeNetwork: { mode: 'mainnet' } }),
}));
jest.mock('../../../../../ui/Tooltip', () => ({
  Tooltip: ({ content, children }: { content: string; children: ReactNode }) => (
    <div title={content}>{children}</div>
  ),
}));
jest.mock('../../StatSection', () => ({
  StatSection: (props: Record<string, ReactNode>) => (
    <div>
      {props.title}
      <span data-testid="main">{props.bodyMainText}</span>
      <span data-testid="secondary">{props.bodySecondaryText}</span>
      <span data-testid="caption">{props.caption}</span>
    </div>
  ),
}));
jest.mock('../../../ErrorBoundary', () => ({
  ExplorerErrorBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const mockSupply = useSuspenseStxSupply as jest.MockedFunction<typeof useSuspenseStxSupply>;

test('renders the v3 µSTX total as both circulating and total supply', () => {
  mockSupply.mockReturnValue({
    data: { total: '1874370687477029', projected_total_2050: '2318000000000000' },
  } as ReturnType<typeof useSuspenseStxSupply>);

  render(
    <ChakraProvider value={system}>
      <StxSupply />
    </ChakraProvider>
  );

  expect(screen.getByTestId('main')).toHaveTextContent('1.87B');
  expect(screen.getByTestId('secondary')).toHaveTextContent('1.87B');
  expect(screen.getByTestId('caption')).toHaveTextContent('100% of total supply is circulating');
  expect(screen.getByTitle(/Year 2050 supply is ~2.32B/)).toBeInTheDocument();
});
