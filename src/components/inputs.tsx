import { forwardRef } from '@chakra-ui/react';

import { Input as InputBase, InputProps } from '@/ui/components';

export const Input = forwardRef<InputProps, 'input'>((props, ref) => (
  <InputBase
    bg="transparent"
    color="var(--colors-text-body)"
    borderColor="var(--stacks-colors-border)"
    _hover={{ borderColor: 'var(--stacks-colors-border)' }}
    _focus={{
      boxShadow: '0 0 0 1px rgba(170, 179, 255, 0.6)',
    }}
    ref={ref}
    {...props}
  />
));
