import { Box, BoxProps } from '@stacks/ui';

import React from 'react';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const StxInline: ForwardRefExoticComponentWithAs<BoxProps, 'svg'> = forwardRefWithAs<
  BoxProps,
  'svg'
>(({ color = 'currentColor', as = 'svg', strokeWidth = '1.5', ...props }, ref) => (
  <Box
    display="block"
    as={as}
    height="auto"
    viewBox="0 0 24 24"
    fill="none"
    ref={ref}
    color={color}
    transform="translate(0, 0)"
    {...props}
  >
    <path
      d="M16.7364 9.50628C18.7225 9.50628 20.4296 10.2204 21.8577 11.6485C23.2859 13.0544 24 14.7727 24 16.8033C24 18.7894 23.2859 20.4854 21.8577 21.8912C20.4296 23.2971 18.7225 24 16.7364 24L6.32636 24C4.96513 24 3.72664 23.6653 2.61088 22.9958C1.49512 22.304 0.624826 21.378 0 20.2176L7.83264 13.9247C7.81032 13.9247 7.77685 13.9358 7.73222 13.9582C7.68759 13.9805 7.65411 13.9916 7.6318 13.9916C5.71269 13.9916 4.06137 13.311 2.67782 11.9498C1.3166 10.5662 0.635983 8.91492 0.635983 6.99582C0.635983 5.07671 1.3166 3.43654 2.67782 2.07531C4.06137 0.691771 5.71269 0 7.6318 0L17.0042 0C18.1869 0 19.2803 0.27894 20.2845 0.83682C21.311 1.3947 22.159 2.16457 22.8285 3.14644L16.0335 9.60669C16.2343 9.53975 16.4686 9.50628 16.7364 9.50628Z"
      fill="currentColor"
    />
  </Box>
));
