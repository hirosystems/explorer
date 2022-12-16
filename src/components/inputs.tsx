import * as React from 'react';

import { Input as InputBase, InputProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export const Input = forwardRefWithAs<InputProps, 'input'>((props, ref) => (
  <InputBase
    bg="transparent"
    color="var(--colors-text-body)"
    borderColor="var(--colors-border)"
    _hover={{ borderColor: 'var(--colors-border)' }}
    _focus={{
      boxShadow: '0 0 0 1px rgba(170, 179, 255, 0.6)',
    }}
    ref={ref}
    {...props}
  />
));
