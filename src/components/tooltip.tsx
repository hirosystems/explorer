import Tippy, { TippyProps } from '@tippyjs/react';
import * as React from 'react';

import { Box, BoxProps } from '@stacks/ui';

export const Tooltip: React.FC<
  TippyProps & { label: TippyProps['content']; labelProps?: BoxProps }
> = ({ label, labelProps = {}, 'aria-label': ariaLabel = label, ...rest }: any) => {
  return (
    <Tippy
      content={
        <Box as="span" display="block" {...labelProps}>
          {label}
        </Box>
      }
      trigger="mouseenter"
      hideOnClick={undefined}
      {...rest}
    />
  );
};
