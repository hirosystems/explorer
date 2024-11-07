import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import renderer from 'react-test-renderer';
import { IncidentImpact } from 'statuspage.io';

import { StatusBarBase } from '../StatusBarBase';

describe('StatusBarBase', () => {
  it('renders correctly (critical impact)', () => {
    const tree = renderer
      .create(
        <ChakraProvider value={system}>
          <StatusBarBase impact={IncidentImpact.Critical} content={<div>Test Content</div>} />
        </ChakraProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly (non-critical impact)', () => {
    const tree = renderer
      .create(
        <ChakraProvider value={system}>
          <StatusBarBase impact={IncidentImpact.Minor} content={<div>Test Content</div>} />
        </ChakraProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
