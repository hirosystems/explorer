import { Global, css } from '@emotion/react';
import React, { memo, useEffect, useRef } from 'react';

import type { BoxProps } from '@stacks/ui';
import { Box, transition } from '@stacks/ui';
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
          background-image: url('https://blockstack-www.imgix.net/metaverse/gradient.jpg?auto=format,compress&w=1800'),
            linear-gradient(
              30deg,
              rgba(98, 135, 221, 1) 0%,
              rgba(231, 72, 92, 1) 58%,
              rgba(102, 137, 221, 1) 100%
            );
        }
      }

      html.light {
        .metaverse-bg {
          background-image: url('https://blockstack-www.imgix.net/metaverse/gradient.jpg?auto=format,compress&w=1800'),
            linear-gradient(
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

const Grain: React.FC<BoxProps> = memo(props => (
  <Box
    as="img"
    src="https://blockstack-www.imgix.net/metaverse/grain.jpg?auto=format,compress&w=1800"
    width="100%"
    position="absolute"
    left={0}
    top={0}
    mixBlendMode="multiply"
    minWidth="1600px"
    zIndex={999999}
    imageRendering="crisp-edges"
    {...props}
  />
));

const Video: React.FC = memo(() => {
  const ref = useRef<null | HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.playbackRate && ref.current.playbackRate === 1) {
      ref.current.playbackRate = 0.85;
    }
  }, [ref.current]);
  return (
    <video
      className="metaverse-video"
      playsInline
      autoPlay
      muted
      loop
      ref={ref}
      poster="https://blockstack-www.imgix.net/metaverse/gradient.jpg?auto=format&w=1800"
    >
      <source src="https://blockstack-www.imgix.net/metaverse/video.mp4" type="video/mp4" />
    </video>
  );
});

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
        <Grain opacity={0.45} />
        <Grain />
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
