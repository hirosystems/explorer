import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import '@testing-library/jest-dom';

import { DesktopNav } from '../DesktopNav';

describe('DesktopNav', () => {
  it('should render correctly', () => {
    const mockNavItems = [
      {
        id: '1',
        label: 'Sample Item 1',
        href: '#',
        children: [
          {
            id: '1.1',
            label: 'Sub Item 1',
            href: '#',
          },
        ],
      },
      {
        id: '2',
        label: 'Sample Item 2',
        href: '#',
      },
    ];

    const { asFragment } = renderWithChakraProviders(<DesktopNav navItems={mockNavItems} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
