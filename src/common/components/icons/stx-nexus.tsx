import { forwardRef } from '@chakra-ui/react';
import React from 'react';

import { Box, BoxProps } from '../../../ui/Box';

export const StxNexus = forwardRef<BoxProps, 'svg'>(
  ({ color = 'white', as = 'svg', ...props }, ref) => (
    <Box
      display="block"
      as={as}
      height="auto"
      viewBox="0 0 400 400"
      fill="none"
      ref={ref}
      color={color}
      {...props}
    >
      <clipPath id="stx-nexus">
        <path
          d="M278.086 271.369L363.056 400H299.58L199.832 248.866L100.084 400H36.9437L121.914 271.704H0V223.006H400V271.369H278.086Z"
          fill="currentColor"
          shapeRendering="geometricPrecision"
        />
        <path
          d="M400 126.952V175.651V175.987H0V126.952H119.563L35.6003 0H99.0764L199.832 153.149L300.924 0H364.4L280.437 126.952H400Z"
          fill="currentColor"
          shapeRendering="geometricPrecision"
        />
      </clipPath>
      <path
        d="M278.086 271.369L363.056 400H299.58L199.832 248.866L100.084 400H36.9437L121.914 271.704H0V223.006H400V271.369H278.086Z"
        fill="currentColor"
        shapeRendering="geometricPrecision"
      />
      <path
        d="M400 126.952V175.651V175.987H0V126.952H119.563L35.6003 0H99.0764L199.832 153.149L300.924 0H364.4L280.437 126.952H400Z"
        fill="currentColor"
        shapeRendering="geometricPrecision"
      />
    </Box>
  )
);
