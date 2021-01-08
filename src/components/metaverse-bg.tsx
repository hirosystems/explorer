import React from 'react';
import type { BoxProps } from '@stacks/ui';
import { Box } from '@stacks/ui';
import { css, Global } from '@emotion/react';
import type { ForwardRefExoticComponentWithAs } from '@stacks/ui-core';
import { forwardRefWithAs } from '@stacks/ui-core';

const GlobalStyles = () => (
  <Global
    styles={css`
      html.dark {
        .metaverse-bg {
          opacity: 0.75;
          background-image: url('http://blockstack-www.imgix.net/metaverse-bg-dark.png?auto=format,compress');
        }
      }
      html.light {
        .metaverse-bg {
          background-image: url('http://blockstack-www.imgix.net/metaverse-bg.png?auto=format,compress');
        }
      }
    `}
  />
);

export const MetaverseBg: ForwardRefExoticComponentWithAs<BoxProps, 'div'> = forwardRefWithAs<
  BoxProps,
  'div'
>(({ as = 'div', ...rest }, ref) => {
  return (
    <>
      <GlobalStyles />
      <Box
        className="metaverse-bg"
        as={as}
        backgroundSize="cover"
        maxWidth="100%"
        backgroundPosition="50% 29%"
        width="100%"
        minWidth="1600px"
        ref={ref}
        {...rest}
      />
    </>
  );
});
