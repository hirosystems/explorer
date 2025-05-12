import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { StatusBarBase } from '../StatusBarBase';

describe('StatusBarBase', () => {
  it('renders correctly (critical impact)', () => {
    const { asFragment } = render(
      <ChakraProvider value={system}>
        <StatusBarBase content={<div>Test Content</div>} />
      </ChakraProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly (non-critical impact)', () => {
    const { asFragment } = render(
      <ChakraProvider value={system}>
        <StatusBarBase content={<div>Test Content</div>} />
      </ChakraProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
