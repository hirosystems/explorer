import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

import { MobileNav } from '../MobileNav';

describe('MobileNav', () => {
  it('should render correctly', () => {
    const mockNavItems = [
      {
        id: '1',
        label: 'Mobile Sample Item 1',
        href: '#',
        children: [
          {
            id: '1.1',
            label: 'Mobile Sub Item 1',
            href: '#',
          },
        ],
      },
      {
        id: '2',
        label: 'Mobile Sample Item 2',
        href: '#',
      },
    ];

    const mockClose = jest.fn();

    const { asFragment } = render(<MobileNav navItems={mockNavItems} close={mockClose} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
