'use client';

import { Icon, IconBase, IconWeight } from '@phosphor-icons/react';
import { ReactElement, forwardRef } from 'react';

const weights = new Map<IconWeight, ReactElement>([
  [
    'regular',
    <>
      <path
        d="M12.0677 12.2385V11.2854H13.7425V6.70531H12.0677V5.76154H16.4998V6.70531H14.8343V11.2854H16.4998V12.2385H12.0677Z"
        fill="currentColor"
      />
      <path
        d="M6.63135 12.2385V5.76154H9.12033C10.3602 5.76154 11.1837 6.52026 11.1837 7.69536C11.1837 8.87046 10.3602 9.62918 9.12033 9.62918H7.72317V12.2385H6.63135ZM7.72317 8.6854H9.04631C9.694 8.6854 10.0826 8.31529 10.0826 7.69536C10.0826 7.07542 9.694 6.70531 9.04631 6.70531H7.72317V8.6854Z"
        fill="currentColor"
      />
      <path
        d="M3.19267 7.27898L2.37843 9.77722H4.00691L3.19267 7.27898ZM0.500122 12.2385L2.70227 5.76154H3.68306L5.88521 12.2385H4.8119L4.31225 10.71175H2.08234L1.58269 12.2385H0.500122Z"
        fill="currentColor"
      />
    </>,
  ],
]);

const FunctionReadOnlyIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox={'0 0 19 19'} />
));

FunctionReadOnlyIcon.displayName = 'FunctionReadOnlyIcon';

export default FunctionReadOnlyIcon;
