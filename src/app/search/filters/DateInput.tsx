'use client';

import { forwardRef } from '@chakra-ui/react';

import { Input } from '../../../ui/Input';

export const DateInput = forwardRef((props, ref) => (
  <Input
    sx={{
      '::placeholder': {
        color: 'textSubdued',
      },
    }}
    ref={ref}
    {...props}
  />
));
