import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { TabsContainer } from '../TabsContainer';

const tabs = [
  {
    title: 'Tab 1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    content: 'Tab 2 content',
  },
];

describe('TabsContainer', () => {
  it('renders tabs with correct title', () => {
    const { getAllByRole } = render(<TabsContainer tabs={tabs} />);
    const tabList = getAllByRole('tab');
    expect(tabList).toHaveLength(2);
    expect(tabList[0]).toHaveTextContent('Tab 1');
    expect(tabList[1]).toHaveTextContent('Tab 2');
  });

  it('displays correct tab content when a tab is clicked', async () => {
    const { getAllByRole, getByText } = render(<TabsContainer tabs={tabs} />);
    const tabList = getAllByRole('tab');
    fireEvent.click(tabList[1]);
    await waitFor(() => {
      expect(getByText('Tab 2 content')).toBeVisible();
    });
    fireEvent.click(tabList[0]);
    await waitFor(() => {
      expect(getByText('Tab 1 content')).toBeVisible();
    });
  });
});
