'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  // TODO: fix this icon
  [
    'regular',
    <g>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="9.5" cy="9.5" r="6.5" />
      <rect x="10" y="10" width="11" height="11" rx="2" />
    </g>,
  ],
]);

const FungibleTokenIcon: Icon = forwardRef((props, ref) => (
  <IconBase
    ref={ref}
    {...props}
    weights={weights}
    width="44px"
    height="auto"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));

FungibleTokenIcon.displayName = 'FungibleTokenIcon';

export default FungibleTokenIcon;
