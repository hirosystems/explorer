import { render } from '@testing-library/react';

import { TestnetBanner } from '../TestnetBanner';

jest.mock('@/common/context/useGlobalContext', () => ({
  useGlobalContext: () => ({
    activeNetwork: { mode: 'mainnet' }, // Not 'testnet'
  }),
}));

describe('TestnetBanner', () => {
  it('renders nothing when not on testnet', () => {
    const { container } = render(<TestnetBanner />);
    expect(container).toBeEmptyDOMElement();
  });
});
