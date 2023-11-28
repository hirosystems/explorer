import React from 'react';
import renderer from 'react-test-renderer';
import { IncidentImpact } from 'statuspage.io';

import { StatusBarBase } from '../StatusBarBase';

describe('StatusBarBase', () => {
  it('renders correctly (critical impact)', () => {
    const tree = renderer
      .create(<StatusBarBase impact={IncidentImpact.Critical} content={<div>Test Content</div>} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly (non-critical impact)', () => {
    const tree = renderer
      .create(<StatusBarBase impact={IncidentImpact.Minor} content={<div>Test Content</div>} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
