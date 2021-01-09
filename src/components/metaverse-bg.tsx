import React from 'react';
import type { BoxProps } from '@stacks/ui';
import { Box, transition } from '@stacks/ui';
import { css, Global } from '@emotion/react';
import type { ForwardRefExoticComponentWithAs } from '@stacks/ui-core';
import { forwardRefWithAs } from '@stacks/ui-core';

const GlobalStyles = () => (
  <Global
    styles={css`
      html.dark {
        .metaverse-bg {
          opacity: 0.75;
          background-image: url('https://blockstack-www.imgix.net/metaverse-v2-temp-dark.png?auto=format,compress');
        }
      }

      html.light {
        .metaverse-bg {
          background-image: url('https://blockstack-www.imgix.net/metaverse-v2-temp.png?auto=format,compress');
        }
      }
    `}
  />
);

export const MetaverseBg: ForwardRefExoticComponentWithAs<BoxProps, 'div'> = forwardRefWithAs<
  BoxProps,
  'div'
>(({ as = 'div', height = '380px', ...rest }, ref) => {
  return (
    <Box
      className="metaverse-header"
      position="fixed"
      zIndex={1}
      width="100%"
      top={0}
      height={height}
      overflow="hidden"
      transition={transition}
    >
      <GlobalStyles />
      <Box
        className="metaverse-bg"
        as={as}
        backgroundSize="cover"
        maxWidth="100%"
        backgroundPosition="50% 29%"
        width="100%"
        minWidth="1600px"
        height={height}
        ref={ref}
        {...rest}
      />
    </Box>
  );
});
