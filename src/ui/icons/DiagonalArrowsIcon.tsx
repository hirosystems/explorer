'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path
        d="M11.5475 7.44141H14.595V10.4889"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.97632 15.0602L14.595 7.44149"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.45256 10.4889H2.40508V7.44147"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0238 2.87021L2.40509 10.4889"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  ],
]);

const DiagonalArrowsIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 17 17'} />
));

DiagonalArrowsIcon.displayName = 'DiagonalArrowsIcon';

export default DiagonalArrowsIcon;
