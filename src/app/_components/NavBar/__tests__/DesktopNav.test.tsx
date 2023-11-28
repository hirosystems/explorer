import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

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

    const { asFragment } = render(<DesktopNav navItems={mockNavItems} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
