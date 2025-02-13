'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
      <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
    </>,
  ],
]);

const WalletIcon: Icon = forwardRef((props, ref) => (
  <IconBase
    ref={ref}
    {...props}
    weights={weights}
    viewBox="0 0 24 24"
    strokeWidth="1"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));

WalletIcon.displayName = 'WalletIcon';

export default WalletIcon;
