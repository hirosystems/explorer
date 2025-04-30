'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path
        fill="currentColor"
        stroke="currentColor"
        d="M10.9,6.7H1.1c-.155,0-.2.2-.2.3v.6c0,.2.1.3.2.3h3c.1,0,.2.1.2.1.061.087,0,.2,0,.2l-1.9,2.8c-.087.147,0,.3,0,.3.054.101.2.1.2.1h.7c.1,0,.2-.1.2-.1l2.2-3.3c.063-.089.1-.1.2-.1h.2c.1,0,.137.011.2.1l2.2,3.3s.1.1.2.1h.7s.146.001.2-.1c0,0,.087-.153,0-.3l-1.9-2.8s-.061-.113,0-.2c0,0,.1-.1.2-.1h3c.1,0,.2-.1.2-.3v-.6c0-.1-.045-.3-.2-.3Z"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        d="M1.1,5.3h9.8c.155,0,.2-.2.2-.3v-.6c0-.2-.1-.3-.2-.3h-3c-.1,0-.2-.1-.2-.1-.061-.087,0-.2,0-.2l1.9-2.8c.087-.147,0-.3,0-.3-.054-.101-.2-.1-.2-.1h-.7c-.1,0-.2.1-.2.1l-2.2,3.3c-.063.089-.1.1-.2.1h-.2c-.1,0-.137-.011-.2-.1L3.5.7s-.1-.1-.2-.1h-.7s-.146-.001-.2.1c0,0-.087.153,0,.3l1.9,2.8s.061.113,0,.2c0,0-.1.1-.2.1H1.1c-.1,0-.2.1-.2.3v.6c0,.1.045.3.2.3Z"
      />
    </>,
  ],
]);

// Thin: Suitable for smaller sizes (used in tables)
const StxIconThin: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 12 12'} fill="none" />
));

StxIconThin.displayName = 'StacksIconThin';

export default StxIconThin;
