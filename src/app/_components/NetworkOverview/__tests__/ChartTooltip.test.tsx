import { renderWithProviders } from '@/common/utils/test-utils/render-utils';
import '@testing-library/jest-dom';
import { TooltipProps } from 'recharts';

import { ChartTooltip } from '../ChartTooltip';

function renderTooltip(active: boolean = true) {
  const payload: TooltipProps<number, string>['payload'] = [
    {
      value: 42,
      payload: { date: new Date('2023-01-01T00:00:00Z'), burnBlockHash: '1234567890' },
    } as any,
  ];
  const label = 'Jan 1, 2023';
  return renderWithProviders(<ChartTooltip active={active} payload={payload} label={label} />);
}

describe('ChartTooltip', () => {
  it('renders aggregation interval text when active', () => {
    const { getByText } = renderTooltip();
    expect(getByText('In Bitcoin block 1234…7890')).toBeInTheDocument();
  });

  it('renders nothing when inactive', () => {
    const { container } = renderTooltip(false);
    expect(container.firstChild).toBeNull();
  });
});
