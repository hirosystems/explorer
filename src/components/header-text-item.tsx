import { forwardRef } from '@chakra-ui/react';
import React from 'react';
import { TextLink } from '@/ui/components';
import { TextProps } from '@/ui/typography';

export const HeaderTextItem = forwardRef<TextProps, 'a'>((props, ref) => (
  <TextLink
    _hover={{
      textDecoration: 'underline',
    }}
    fontSize="14px"
    fontWeight={500}
    color="white"
    ref={ref}
    {...props}
  />
));
