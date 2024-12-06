'use client';

import { forwardRef } from 'react';

import { Input, InputProps } from '../../../ui/Input';

export const DateInput = forwardRef<HTMLInputElement, InputProps>((inputProps, ref) => (
  <Input
    css={{
      '::placeholder': {
        color: 'textSubdued',
      },
    }}
    ref={ref}
    {...inputProps}
  />
));
