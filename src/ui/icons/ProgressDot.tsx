'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <circle cx="7" cy="7" r="7" fill="currentColor" fillOpacity="0.3" />
      <circle cx="7" cy="7" r="3" fill="currentColor" />
    </>,
  ],
]);

const ProgressDot: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 14 14'} fill={'none'} />
));

ProgressDot.displayName = 'ProgressDot';

export default ProgressDot;
