import React from 'react';
import { Box, BoxProps, transition } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const IconButton: ForwardRefExoticComponentWithAs<
  BoxProps & { icon: any },
  'button'
> = forwardRefWithAs(({ icon: Icon, ...rest }, ref) => {
  return (
    <Box
      p="tight"
      borderRadius="100%"
      _hover={{ bg: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}
      color="white"
      transition={transition}
      ref={ref}
      size={'36px'}
      {...rest}
    >
      <Icon size={'20px'} />
    </Box>
  );
});
