import React from 'react';
import { Box, BoxProps, color, Grid, transition } from '@stacks/ui';
import {
  ForwardRefExoticComponentWithAs,
  forwardRefWithAs,
  MemoExoticComponentWithAs,
  memoWithAs,
} from '@stacks/ui-core';

export const IconButton: MemoExoticComponentWithAs<
  BoxProps & {
    icon: any;
    dark?: boolean;
    invert?: boolean;
    iconSize?: BoxProps['size'];
    iconProps?: BoxProps;
    isHovered?: boolean;
  },
  'button'
> = memoWithAs(
  forwardRefWithAs(
    (
      {
        icon: Icon,
        iconSize = '20px',
        iconProps = {},
        dark,
        invert,
        _hover = {},
        isHovered,
        ...rest
      },
      ref
    ) => {
      const hoverStyles = isHovered
        ? {
            bg: invert ? color('bg-light') : !dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
            cursor: 'pointer',
            ..._hover,
          }
        : {};
      return (
        <Grid
          placeItems="center"
          borderRadius="100%"
          _hover={{
            bg: invert ? color('bg-light') : !dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
            cursor: 'pointer',
            ..._hover,
          }}
          color={!dark ? 'white' : 'ink.600'}
          transition={transition}
          ref={ref}
          size={'36px'}
          {...rest}
          {...hoverStyles}
        >
          <Icon display="block" size={iconSize} {...iconProps} />
        </Grid>
      );
    }
  )
);
