import React from 'react';
import { BoxProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { Link } from '@components/typography';

export const HeaderTextItem = forwardRefWithAs<BoxProps, 'a'>((props, ref) => (
  <Link fontSize="14px" fontWeight={500} color="white" ref={ref as any} {...props} />
));
