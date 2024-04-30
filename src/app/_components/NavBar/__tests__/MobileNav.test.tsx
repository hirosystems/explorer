import '@testing-library/jest-dom';

import { renderWithReduxProviders } from '../../../../common/utils/test-utils/renderWithReduxProvider';
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

    const { asFragment } = renderWithReduxProviders(
      <MobileNav
        navItems={mockNavItems}
        close={mockClose}
        tokenPrice={{
          btcPrice: 0,
          stxPrice: 0,
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
