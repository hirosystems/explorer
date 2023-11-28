import { render } from '@testing-library/react';
import React from 'react';

import { MicroblockListItem } from '../MicroblockListItem';

jest.mock('../../../../common/utils/utils', () => ({
  toRelativeTime: jest.fn(time => `MockRelativeTime${time}`),
}));

describe('MicroblockListItem component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <MicroblockListItem blockTime={1619047871} hash="mockHash" index={1} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
