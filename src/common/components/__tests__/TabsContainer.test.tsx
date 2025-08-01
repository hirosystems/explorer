import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import '@testing-library/jest-dom';
import { RenderResult, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

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
  it('renders tabs with correct title', async () => {
    let utils: RenderResult;
    await act(async () => {
      utils = renderWithChakraProviders(<TabsContainer tabs={tabs} />);
    });

    const tabList = utils!.getAllByRole('tab');
    expect(tabList).toHaveLength(2);
    expect(tabList[0]).toHaveTextContent('Tab 1');
    expect(tabList[1]).toHaveTextContent('Tab 2');
  });

  it('displays correct tab content when a tab is clicked', async () => {
    let utils: RenderResult;
    await act(async () => {
      utils = renderWithChakraProviders(<TabsContainer tabs={tabs} />);
    });

    // Initial state check
    expect(screen.getByText('Tab 1 content')).toBeVisible();

    const tab2 = screen.getByRole('tab', { name: /tab 2/i });

    // Click on tab 2
    await act(async () => {
      tab2.click();
    });

    await waitFor(() => {
      expect(utils!.getByText('Tab 2 content')).toBeVisible();
    });

    // Click on tab 1
    const tab1 = screen.getByRole('tab', { name: /tab 1/i });

    await act(async () => {
      tab1.click();
    });

    await waitFor(() => {
      expect(utils!.getByText('Tab 1 content')).toBeVisible();
    });
  });
});
