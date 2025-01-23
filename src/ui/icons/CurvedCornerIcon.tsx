import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path
        d="M16.4597 15.9019C21.0891 11.2725 21.7683 0 21.7683 0V21.2105H0.5578C0.5578 21.2105 11.8303 20.5313 16.4597 15.9019Z"
        fill="currentColor"
      />
    </>,
  ],
]);

export const CurvedCornerIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox="0 0 22 22" />
));

CurvedCornerIcon.displayName = 'CurvedCornerIcon';
