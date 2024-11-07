import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';

import { TabsContainer } from '../TabsContainer';

const tabs = [
  {
    title: 'Tab 1',
    id: 'tab-1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    id: 'tab-2',
    content: 'Tab 2 content',
  },
];

describe('TabsContainer', () => {
  it('renders tabs with correct title', () => {
    const { getAllByRole } = render(
      <ChakraProvider value={system}>
        <TabsContainer tabs={tabs} />
      </ChakraProvider>
    );
    const tabList = getAllByRole('tab');
    expect(tabList).toHaveLength(2);
    expect(tabList[0]).toHaveTextContent('Tab 1');
    expect(tabList[1]).toHaveTextContent('Tab 2');
  });

  it('displays correct tab content when a tab is clicked', async () => {
    function TestWrapper() {
      return (
        <ChakraProvider value={system}>
          <TabsContainer tabs={tabs} />
        </ChakraProvider>
      );
    }
    const { getByText } = render(
      <ChakraProvider value={system}>
        <TestWrapper />
      </ChakraProvider>
    );
    expect(screen.getByText('Tab 1 content')).toBeVisible();

    const tab1 = screen.getByRole('tab', { name: /tab 1/i });
    const tab2 = screen.getByRole('tab', { name: /tab 2/i });

    await act(async () => {
      await tab2.click();
    });
    await waitFor(() => {
      expect(getByText('Tab 2 content')).toBeVisible();
    });
    expect(getByText('Tab 2 content')).toBeVisible();

    await act(async () => {
      tab1.click();
    });
    await waitFor(() => {
      expect(getByText('Tab 1 content')).toBeVisible();
    });
  });
});
