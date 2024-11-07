'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { Text, TextProps } from '../../ui/Text';

export type BadgeProps = FlexProps & { labelProps?: TextProps };
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, labelProps, ...rest }, ref) => (
    <Flex
      ref={ref}
      alignItems="center"
      justify="center"
      borderRadius="24px"
      py="4px"
      px={['8px', '8px', '12px']}
      borderWidth="1px"
      {...rest}
    >
      <Text
        display="block"
        lineHeight="16px"
        fontSize={['10px', '10px', '11px']}
        fontWeight={600}
        color="currentColor"
        {...labelProps}
      >
        {children}
      </Text>
    </Flex>
  )
);
