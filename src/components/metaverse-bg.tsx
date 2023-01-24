import { Global, css } from '@emotion/react';
import React, { memo } from 'react';

import type { BoxProps } from '@stacks/ui';
import { Box } from '@stacks/ui';
import type { ForwardRefExoticComponentWithAs } from '@stacks/ui-core';
import { forwardRefWithAs } from '@stacks/ui-core';

const GlobalStyles = () => (
  <Global
    styles={css`
      video.metaverse-video {
        filter: brightness(0.95);
        object-fit: cover;
        width: 100vw;
        height: calc(380px + 29%);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
      }

      html.dark {
        .metaverse-header {
          opacity: 0.5;
        }

        .metaverse-bg {
          display: none;
          opacity: 0.65;
          background-image: linear-gradient(
            30deg,
            rgba(98, 135, 221, 1) 0%,
            rgba(231, 72, 92, 1) 58%,
            rgba(102, 137, 221, 1) 100%
          );
        }
      }

      html.light {
        .metaverse-bg {
          background-image: linear-gradient(
            30deg,
            rgba(98, 135, 221, 1) 0%,
            rgba(231, 72, 92, 1) 58%,
            rgba(102, 137, 221, 1) 100%
          );
        }
      }
    `}
  />
);

export const MetaverseBg: ForwardRefExoticComponentWithAs<BoxProps, 'div'> = memo(
  forwardRefWithAs<BoxProps, 'div'>(({ as = 'div', height = '530px', ...rest }, ref) => {
    return (
      <Box
        className="metaverse-header"
        position="fixed"
        zIndex={1}
        width="100%"
        top={0}
        height={height}
        overflow="hidden"
      >
        <GlobalStyles />
        <Box
          className="metaverse-bg"
          as={as}
          backgroundSize="cover"
          maxWidth="100%"
          backgroundPosition="0% 29%"
          width="100%"
          height="60vh"
          ref={ref}
          {...rest}
        />
      </Box>
    );
  })
);
