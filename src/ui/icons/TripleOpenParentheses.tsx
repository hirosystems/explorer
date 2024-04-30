'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <rect x="1" y="1.14124" width="39" height="39" rx="19.5" fill="white" stroke="#E8E8EC" />
      <path
        d="M23.92 19.9312L27.34 23.3512L23.92 26.7712"
        stroke="#1C2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 19.9312L23.92 23.3512L20.5 26.7712"
        stroke="#1C2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.66 16.5112C13.66 18.3253 14.3806 20.0651 15.6634 21.3478C16.9461 22.6306 18.6859 23.3512 20.5 23.3512L23.92 23.3512"
        stroke="#1C2024"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  ],
]);

const TripleOpenParentheses: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 41 41'} fill={'none'} />
));

TripleOpenParentheses.displayName = 'TripleOpenParentheses';

export default TripleOpenParentheses;
