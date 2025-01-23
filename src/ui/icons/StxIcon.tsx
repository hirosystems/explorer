'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path d="M5.9,5.7c0,0-.1.1-.2.1H.9c-.3,0-.4.2-.4.5v1c0,.3.2.5.5.5h16c.3,0,.5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-4.7c0,0-.2,0-.2-.1h0c0,0,0-.2,0-.2h0S15.2.8,15.2.8c0-.1.1-.3,0-.5,0-.2-.3-.3-.5-.3h-1.2c-.2,0-.3,0-.4.2l-3.6,5.4c0,.1-.2.2-.3.2h-.5c-.1,0-.2,0-.3-.2L4.9.2h0c-.1-.1-.3-.2-.4-.2h-1.2c-.2,0-.4,0-.5.3,0,.2,0,.4,0,.5h0s3.1,4.6,3.1,4.6c0,0,0,.2,0,.3h0Z" />
      <path d="M17,10.2H1c-.3,0-.5.2-.5.5v1c0,.3.2.5.5.5h4.7c.1,0,.2,0,.2.1h0c0,0,0,.2,0,.2h0s-3.1,4.6-3.1,4.6c0,.1-.1.3,0,.5,0,.2.3.3.5.3h1.2c.2,0,.3,0,.4-.2l3.6-5.4c0-.1.2-.2.3-.2h.5c.1,0,.2,0,.3.2l3.6,5.4c0,.1.2.2.4.2h1.2c.2,0,.4-.1.5-.3,0-.2,0-.4,0-.5l-3.1-4.6h0c0,0,0-.2,0-.2h0c0,0,.1-.1.2-.1h4.7c.3,0,.5-.2.5-.5v-1c0-.3-.2-.5-.5-.5Z" />
    </>,
  ],
]);

const StxIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 18 18'} />
));

StxIcon.displayName = 'StxIcon';

export default StxIcon;
