'use client';

import { forwardRef } from '@chakra-ui/react';
import { IconBaseProps } from 'react-icons';
import { TbMathFunction } from 'react-icons/tb';

export const FunctionIcon = forwardRef<IconBaseProps, 'svg'>((props, ref) => (
  <span ref={ref}>
    <TbMathFunction strokeWidth={1.5} {...props} />
  </span>
));
